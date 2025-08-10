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
            'site_containertwo',
            'Container: Two-Columns',
            '',
            [
                [
                    ['name' => 'Left-Content', 'colPos' => 201],
                    ['name' => 'Right-Content', 'colPos' => 202],
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

    $GLOBALS['TCA']['tt_content']['types']['site_containertwo']['columnsOverrides']['columns_layout']['config'] = [
        'items' => [
            [ 'label' => '50/50', 'value' => '50/50'],
            [ 'label' => '75/25', 'value' => '75/25'],
            [ 'label' => '25/75', 'value' => '25/75'],
            [ 'label' => '33/66', 'value' => '33/66'],
            [ 'label' => '66/33', 'value' => '66/33'],
        ],
    ];
})();
