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

namespace Site\Frontend\ViewHelpers\ContentBlocks;

use TYPO3\CMS\Core\Database\ConnectionPool;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3Fluid\Fluid\Core\ViewHelper\AbstractViewHelper;

class HeroExistsViewHelper extends AbstractViewHelper
{
    public function initializeArguments(): void
    {
        $this->registerArgument('pageId', 'int', 'UID of requested page within frontend.', true);
    }

    public function render(): bool
    {
        $pageId = $this->arguments['pageId'];

        $qb = GeneralUtility::makeInstance(ConnectionPool::class)->getQueryBuilderForTable('tt_content');
        $rows = $qb
            ->count('uid')
            ->from('tt_content')
            ->where(
                $qb->expr()->eq('pid', $pageId),
            )
            ->andWhere(
                $qb->expr()->in('CType', [
                    $qb->createNamedParameter('site_hero'),
                    $qb->createNamedParameter('site_subhero')
                ])
            )
            ->executeQuery()
            ->fetchFirstColumn()[0];

        return $rows > 0;
    }
}
