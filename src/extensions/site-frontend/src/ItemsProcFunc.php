<?php
namespace Site\Frontend;

use TYPO3\CMS\Core\Database\ConnectionPool;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Core\Database\Query\QueryBuilder;
use SimpleXMLElement;

class ItemsProcFunc
{
    /**
     * Filters "persons" by language in a FlexForm, and if we're in a translated record,
     * remaps the selected UID from the original to the localized record (if it exists).
     *
     * @param array $config
     */
    public function filterPersonsByLanguage(array &$config): void
    {
        $contentElementUid = $this->getContentElementUid($config);
        if ($contentElementUid === 0) {
            return;
        }

        $languageUid = $this->determineLanguageUid($contentElementUid);
        $selectedPersonUid = $this->getSelectedPersonUid($config);

        if ($languageUid > 0 && $selectedPersonUid > 0) {
            $translatedPersonUid = $this->findTranslatedPersonUid($selectedPersonUid, $languageUid);
            if ($translatedPersonUid !== null && $translatedPersonUid !== $selectedPersonUid) {
                $this->updateFlexFormWithTranslatedUid($contentElementUid, $translatedPersonUid);
                $this->updateConfigSelectedPersonUid($config, $translatedPersonUid);
            }
        }

        $config['items'] = $this->buildItems($languageUid);

    }

    

    /**
     * Update the selected person UID in the $config array to reflect the translated UID.
     *
     * @param array $config
     * @param int $translatedUid
     */
    protected function updateConfigSelectedPersonUid(array &$config, int $translatedUid): void
    {
        $config['row']['settings.contact']= (string)$translatedUid;
        $config['flexParentDatabaseRow']['pi_flexform']['data']['sDEF']['lDEF']['settings.contact']['vDEF'] = (string)$translatedUid;
    }

    /**
     * Get the content element UID from the configuration.
     *
     * @param array $config
     * @return int
     */
    protected function getContentElementUid(array $config): int
    {
        return (int)($config['flexParentDatabaseRow']['uid'] ?? $config['row']['uid'] ?? 0);
    }

    /**
     * Get the selected person UID from the FlexForm.
     *
     * @param array $config
     * @return int
     */
    protected function getSelectedPersonUid(array $config): int
    {
        return (int)($config['flexParentDatabaseRow']['pi_flexform']['data']['sDEF']['lDEF']['settings.contact']['vDEF'] ?? 0);
    }

    /**
     * Update the FlexForm with the translated person UID.
     *
     * @param int $contentElementUid
     * @param int $translatedPersonUid
     */
    protected function updateFlexFormWithTranslatedUid(int $contentElementUid, int $translatedPersonUid): void
    {
        $queryBuilder = GeneralUtility::makeInstance(ConnectionPool::class)
            ->getQueryBuilderForTable('tt_content');

        $row = $queryBuilder
            ->select('pi_flexform')
            ->from('tt_content')
            ->where(
                $queryBuilder->expr()->eq('uid', $queryBuilder->createNamedParameter($contentElementUid, \PDO::PARAM_INT))
            )
            ->executeQuery()
            ->fetchAssociative();

        if (!is_array($row) || empty($row['pi_flexform'])) {
            return;
        }

        $xmlObject = simplexml_load_string($row['pi_flexform']);
        if (!$xmlObject) {
            return;
        }

        $xpathField = $xmlObject->xpath('//field[@index="settings.contact"]/value[@index="vDEF"]');
        if (is_array($xpathField) && isset($xpathField[0])) {
            $xpathField[0][0] = (string)$translatedPersonUid;
        }

        $updatedXml = $xmlObject->asXML();
        if (!$updatedXml) {
            return;
        }

        $queryBuilder
            ->update('tt_content')
            ->where(
                $queryBuilder->expr()->eq('uid', $queryBuilder->createNamedParameter($contentElementUid, \PDO::PARAM_INT))
            )
            ->set('pi_flexform', $updatedXml)
            ->executeStatement();
    }

    /**
     * Build the items array for the given language UID.
     *
     * @param int $languageUid
     * @return array
     */
    protected function buildItems(int $languageUid): array
    {
        $queryBuilder = GeneralUtility::makeInstance(ConnectionPool::class)
            ->getQueryBuilderForTable('tx_site_persons');

        $queryBuilder
            ->select('uid', 'site_persons_firstname')
            ->from('tx_site_persons')
            ->where(
                $queryBuilder->expr()->eq('sys_language_uid', $queryBuilder->createNamedParameter($languageUid, \PDO::PARAM_INT)),
                $queryBuilder->expr()->eq('deleted', 0),
                $queryBuilder->expr()->eq('hidden', 0)
            );

        if ($languageUid === 0) {
            $queryBuilder->andWhere($queryBuilder->expr()->eq('l10n_parent', 0));
        } else {
            $queryBuilder->andWhere($queryBuilder->expr()->gt('l10n_parent', 0));
        }

        $items = [];
        $statement = $queryBuilder->executeQuery();
        while ($row = $statement->fetchAssociative()) {
            $items[] = [
                $row['site_persons_firstname'], // label
                $row['uid']                              // value
            ];
        }

        return $items;
    }

    /**
     * Find the translated person's UID for a given $originalUid in the current $languageUid.
     *
     * @param int $originalUid
     * @param int $languageUid
     * @return int|null
     */
    protected function findTranslatedPersonUid(int $originalUid, int $languageUid): ?int
    {
        $queryBuilder = GeneralUtility::makeInstance(ConnectionPool::class)
            ->getQueryBuilderForTable('tx_site_persons');

        $row = $queryBuilder
            ->select('uid')
            ->from('tx_site_persons')
            ->where(
                $queryBuilder->expr()->eq('l10n_parent', $queryBuilder->createNamedParameter($originalUid, \PDO::PARAM_INT)),
                $queryBuilder->expr()->eq('sys_language_uid', $queryBuilder->createNamedParameter($languageUid, \PDO::PARAM_INT)),
                $queryBuilder->expr()->eq('deleted', 0),
                $queryBuilder->expr()->eq('hidden', 0)
            )
            ->executeQuery()
            ->fetchAssociative();

        return $row['uid'] ?? null;
    }

    /**
     * Determine the sys_language_uid from the tt_content record or overrideVals.
     *
     * @param int $contentElementUid
     * @return int
     */
    protected function determineLanguageUid(int $contentElementUid): int
    {
        $languageUid = 0;

        if ($contentElementUid > 0) {
            $queryBuilder = GeneralUtility::makeInstance(ConnectionPool::class)
                ->getQueryBuilderForTable('tt_content');

            $record = $queryBuilder
                ->select('sys_language_uid')
                ->from('tt_content')
                ->where(
                    $queryBuilder->expr()->eq('uid', $queryBuilder->createNamedParameter($contentElementUid, \PDO::PARAM_INT))
                )
                ->executeQuery()
                ->fetchAssociative();

            $languageUid = (int)($record['sys_language_uid'] ?? 0);
        }

        if ($languageUid === 0) {
            $overrideVals = GeneralUtility::_GP('overrideVals');
            $languageUid = (int)($overrideVals['tt_content']['sys_language_uid'] ?? 0);
        }

        return $languageUid;
    }
}