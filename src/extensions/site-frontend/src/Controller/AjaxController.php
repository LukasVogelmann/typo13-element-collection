<?php
namespace Site\Frontend\Controller;

use Psr\Http\Message\ResponseInterface;
use Site\Frontend\Service\ContentBlocksService;
use TYPO3\CMS\Core\Database\Connection;
use TYPO3\CMS\Core\Database\ConnectionPool;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Extbase\Mvc\Controller\ActionController;

class AjaxController extends ActionController
{
    private const TABLE_NAME = 'tx_site_jobadvertisement';

    public function __construct(private readonly ContentBlocksService $contentBlocksService) {}

    /**
     * Handles AJAX job list requests with optional filters.
     *
     * @return ResponseInterface
     */
    public function showAction(): ResponseInterface
    {
        $uidsString = GeneralUtility::_POST('jobs') ?? '';
        $uids = array_filter(array_map('intval', explode(',', $uidsString)));

        $departments = GeneralUtility::_POST('departments') ?? [];
        $positions = GeneralUtility::_POST('positions') ?? [];
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

        if (!empty($departments)) {
            $departmentConditions = $queryBuilder->expr()->orX();
            foreach ($departments as $department) {
                $departmentConditions->add(
                    $queryBuilder->expr()->eq(
                        'site_jobadvertisement_department',
                        $queryBuilder->createNamedParameter($department)
                    )
                );
            }
            $queryBuilder->andWhere($departmentConditions);
        }

        if (!empty($positions)) {
            $positionConditions = $queryBuilder->expr()->orX();
            foreach ($positions as $position) {
                $positionConditions->add(
                    $queryBuilder->expr()->eq(
                        'site_jobadvertisement_position',
                        $queryBuilder->createNamedParameter($position)
                    )
                );
            }
            $queryBuilder->andWhere($positionConditions);
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

        $this->view->assign('jobs', $processedJobs);

        return $this->htmlResponse($this->view->render());
    }



}
