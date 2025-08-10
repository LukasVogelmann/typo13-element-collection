<?php

declare(strict_types=1);

/*
 * This file is part of the package site/webapp.
 * For the full copyright and license information, please read the
 * LICENSE file that was distributed with this source code.
 *
 * It is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License, either version 2
 * of the License, or any later version.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 * The TYPO3 project - inspiring people to share!
 */

namespace Site\Frontend\Service;

use TYPO3\CMS\ContentBlocks\DataProcessing\ContentBlocksDataProcessor;
use TYPO3\CMS\Core\Database\ConnectionPool;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Frontend\ContentObject\ContentObjectRenderer;

class ContentBlocksService
{
    public function __construct(
        private readonly ContentBlocksDataProcessor $contentBlocksDataProcessor,
    ) {}

    /**
     * @return array<mixed>
     */
    public function resolveProcessCollection(string $table, int $uid, string $fieldName = 'pid'): array
    {
        $qb = GeneralUtility::makeInstance(ConnectionPool::class)->getQueryBuilderForTable($table);
        $rows = $qb
            ->select('*')
            ->from($table)
            ->where(
                $qb->expr()->eq($fieldName, $qb->createNamedParameter($uid, \PDO::PARAM_INT))
            )
            ->executeQuery()
            ->fetchAllAssociative();

        $cObj = new ContentObjectRenderer();

        foreach ($rows as $i => $row) {
            $cObj->start($row, $table);
            $rows[$i] = $this->contentBlocksDataProcessor->process($cObj, [], [], ['data' => $row]);
        }

        if (is_iterable($rows) && count($rows) === 1) {
            return $rows[0];
        }

        return $rows;
    }
}
