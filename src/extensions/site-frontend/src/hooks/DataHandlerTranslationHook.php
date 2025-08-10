<?php
declare(strict_types=1);

namespace Site\Frontend\hooks;

use TYPO3\CMS\Core\DataHandling\DataHandler;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Core\Database\ConnectionPool;
use TYPO3\CMS\Core\Log\LogManager;

class DataHandlerTranslationHook
{


    /**
     * This hook is called before a record is saved.
     *
     * @param array       $incomingFieldArray The field array which will be saved.
     * @param string      $table              The table name (we work on tt_content).
     * @param int|string  $id                 The record UID (or "NEW..." for new records).
     * @param DataHandler $pObj               The calling DataHandler instance.
     */
    public function processDatamap_preProcessFieldArray(
        array &$incomingFieldArray,
        string $table,
        $id,
        DataHandler $pObj
    ): void {

        if ($table !== 'tt_content') {
            return;
        }

        if (
            !isset(
                $incomingFieldArray['pi_flexform']['data']['sDEF']['lDEF']['settings.contact']['vDEF']
            )
        ) {
            return;
        }

        $selectedPersonUid = (int)$incomingFieldArray['pi_flexform']['data']['sDEF']['lDEF']['settings.contact']['vDEF'];

        if ($selectedPersonUid <= 0) {
            return;
        }

        $languageUid = $this->determineLanguageUid((int)$id, $incomingFieldArray, $pObj);

        if ($languageUid <= 0) {
            return;
        }

        // Find the translated person's UID.
        $translatedPersonUid = $this->findTranslatedPersonUid($selectedPersonUid, $languageUid);

        $incomingFieldArray['pi_flexform']['data']['sDEF']['lDEF']['settings.contact']['vDEF'] = (string)$translatedPersonUid;
        
    }

    /**
     * Determine the language UID for the content element.
     *
     * @param int         $contentElementUid The record UID (0 for new records).
     * @param array       $incomingFieldArray  The incoming data.
     * @param DataHandler $pObj
     * @return int
     */
    protected function determineLanguageUid(int $contentElementUid, array $incomingFieldArray, DataHandler $pObj): int
    {
        if (isset($incomingFieldArray['sys_language_uid'])) {
            return (int)$incomingFieldArray['sys_language_uid'];
        }
        if ($contentElementUid > 0) {
            $queryBuilder = GeneralUtility::makeInstance(ConnectionPool::class)
                ->getQueryBuilderForTable('tt_content');
            $record = $queryBuilder
                ->select('sys_language_uid')
                ->from('tt_content')
                ->where(
                    $queryBuilder->expr()->eq(
                        'uid',
                        $queryBuilder->createNamedParameter($contentElementUid, \PDO::PARAM_INT)
                    )
                )
                ->executeQuery()
                ->fetchAssociative();
            $languageUid = (int)($record['sys_language_uid'] ?? 0);
            return $languageUid;
        }
        $overrideVals = GeneralUtility::_GP('overrideVals');
        $languageUid = (int)($overrideVals['tt_content']['sys_language_uid'] ?? 0);
        return $languageUid;
    }

    /**
     * Find the translated person's UID for a given original person UID.
     *
     * @param int $originalUid The UID of the original (non-localized) person.
     * @param int $languageUid The target language UID.
     * @return int|null The translated person UID if found, otherwise null.
     */
    protected function findTranslatedPersonUid(int $originalUid, int $languageUid): ?int
    {
        $queryBuilder = GeneralUtility::makeInstance(ConnectionPool::class)
            ->getQueryBuilderForTable('tx_site_persons');

        $row = $queryBuilder
            ->select('uid')
            ->from('tx_site_persons')
            ->where(
                $queryBuilder->expr()->andX(
                    $queryBuilder->expr()->eq(
                        'l10n_parent',
                        $queryBuilder->createNamedParameter($originalUid, \PDO::PARAM_INT)
                    ),
                    $queryBuilder->expr()->eq(
                        'sys_language_uid',
                        $queryBuilder->createNamedParameter($languageUid, \PDO::PARAM_INT)
                    ),
                    $queryBuilder->expr()->eq('deleted', 0),
                    $queryBuilder->expr()->eq('hidden', 0)
                )
            )
            ->executeQuery()
            ->fetchAssociative();

        $translatedUid = isset($row['uid']) ? (int)$row['uid'] : null;
        return $translatedUid;
    }
}
