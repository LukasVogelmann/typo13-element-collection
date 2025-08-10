<?php

namespace Site\Frontend\Controller;

use Psr\Http\Message\ResponseInterface;
use Site\Frontend\Service\ContentBlocksService;
use TYPO3\CMS\Core\Database\Connection;
use TYPO3\CMS\Core\Database\ConnectionPool;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Extbase\Mvc\Controller\ActionController;

class JobAdvertisementController extends ActionController
{
    private const TABLE_NAME = 'tx_site_jobadvertisement';

    public function __construct(private readonly ContentBlocksService $contentBlocksService) {}


    public function showAction(): ResponseInterface
    {
        
        $filters = $this->getDynamicFilters();
        $uidsString = $this->settings['job'] ?? '';
        $uids = array_filter(array_map('intval', explode(',', $uidsString)));
        $queryBuilder = GeneralUtility::makeInstance(ConnectionPool::class)
            ->getQueryBuilderForTable(self::TABLE_NAME);

        $queryBuilder
            ->select('*')
            ->from(self::TABLE_NAME);

        if (!empty($uids)) {
            $uidConditions = $queryBuilder->expr()->in(
                'uid',
                $queryBuilder->createNamedParameter($uids, Connection::PARAM_INT_ARRAY)
            );
            $queryBuilder->andWhere($uidConditions);
        }

        $jobs = $queryBuilder->executeQuery()->fetchAllAssociative();

        $processedJobs = [];
        foreach ($jobs as $job) {
            $processedJobs[] = $this->contentBlocksService->resolveProcessCollection(
                self::TABLE_NAME,
                $job['uid'],
                'uid'
            );
        }

        $this->view->assignMultiple([
            'filters' => $filters,
            'jobs' => $processedJobs
        ]);

        return $this->htmlResponse();
    }

    /**
     * Extract unique filters (departments and positions) from jobs
     *
     * @return array
     */
    private function getDynamicFilters(): array
    {
        $queryBuilder = GeneralUtility::makeInstance(ConnectionPool::class)
            ->getQueryBuilderForTable(self::TABLE_NAME);

        $departments = $queryBuilder
            ->select('site_jobadvertisement_department')
            ->from(self::TABLE_NAME)
            ->groupBy('site_jobadvertisement_department')
            ->orderBy('site_jobadvertisement_department', 'ASC')
            ->executeQuery()
            ->fetchAllAssociative();

        $positions = $queryBuilder
            ->select('site_jobadvertisement_position')
            ->from(self::TABLE_NAME)
            ->groupBy('site_jobadvertisement_position')
            ->orderBy('site_jobadvertisement_position', 'ASC')
            ->executeQuery()
            ->fetchAllAssociative();

        return [
            'departments' => $departments,
            'positions' => $positions,
        ];
    }
}
