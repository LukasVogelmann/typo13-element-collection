<?php

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

use Site\Frontend\Registry\Container;
use Site\Frontend\Registry\ContainerRegistry;
use TYPO3\CMS\Core\Utility\GeneralUtility;

defined('TYPO3') || die();

(static function () {
    GeneralUtility::makeInstance(ContainerRegistry::class)->register(
        new Container(
            'site_containerone',
            'Container: One-Column',
            '',
            [
                [
                    ['name' => 'Content', 'colPos' => 200],
                ],
            ],
        ),
        [
            '
            --palette--;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:palette.header;header,
            --palette--;Container;containerbase_palette
            ',
        ],
    );
})();
