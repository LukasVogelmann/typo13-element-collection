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

use TYPO3\CMS\Core\Utility\ExtensionManagementUtility;

(static function () {
    $columns = [
        'container_width' => [
            'exclude' => true,
            'label' => 'Container Width',
            'config' => [
                'type' => 'select',
                'renderType' => 'selectSingle',
                'items' => [
                    [ 'label' => 'Default (for Contentelements)', 'value' => 'default'],
                    [ 'label' => 'Fullsize', 'value' => 'fullsize'],
                    [ 'label' => 'Medium', 'value' => 'medium'],
                    [ 'label' => 'Small', 'value' => 'small'],
                ],
            ],
        ],
        'container_background' => [
            'exclude' => true,
            'label' => 'Background Color',
            'config' => [
                'type' => 'select',
                'renderType' => 'selectSingle',
                'items' => [
                    [ 'label' => '-- Default -- ', 'value' => 'default'],
                    [ 'label' => 'Schwarz', 'value' => 'black'],
                    [ 'label' => 'Primärfarbe', 'value' => 'primary'],
                    [ 'label' => 'Akzentfarbe', 'value' => 'accent-dark'],
                    [ 'label' => 'Schmuckfarbe', 'value' => 'secondary'],
                    [ 'label' => 'Hellblau', 'value' => 'baby-blue'],
                    [ 'label' => 'Dunkelgrau', 'value' => 'dark-gray'],
                    [ 'label' => 'Mittelgrau', 'value' => 'light-gray'],
                    [ 'label' => 'Hellgrau', 'value' => 'lighter-gray'],
                ],
            ],
        ],
        'container_padding_x' => [
            'exclude' => true,
            'label' => 'Padding Top and Bottom',
            'config' => [
                'type' => 'select',
                'renderType' => 'selectSingle',
                'items' => [
                    [ 'label' => '-- Default -- ', 'value' => 'default'],
                    [ 'label' => 'Extra Small', 'value' => '1'],
                    [ 'label' => 'Small', 'value' => '2'],
                    [ 'label' => 'Medium', 'value' => '3'],
                    [ 'label' => 'Large', 'value' => '4'],
                    [ 'label' => 'Extra large', 'value' => '5'],
                ],
            ],
        ],
        'container_padding_y' => [
            'exclude' => true,
            'label' => 'Padding Left and Right',
            'config' => [
                'type' => 'select',
                'renderType' => 'selectSingle',
                'items' => [
                    [ 'label' => '-- Default -- ', 'value' => 'default'],
                    [ 'label' => 'Extra Small', 'value' => '1'],
                    [ 'label' => 'Small', 'value' => '2'],
                    [ 'label' => 'Medium', 'value' => '3'],
                    [ 'label' => 'Large', 'value' => '4'],
                    [ 'label' => 'Extra large', 'value' => '5'],
                ],
            ],
        ],
        'columns_layout' => [
            'exclude' => true,
            'label' => 'Columns-Layout',
            'displayCond' => 'FIELD:CType:=:site_containertwo',
            'config' => [
                'type' => 'select',
                'renderType' => 'selectSingle',
            ],
        ],
        'columns_mobile_behaviour' => [
            'exclude' => true,
            'label' => 'Mobile-Behaviour',
            'displayCond' => 'FIELD:CType:!=:site_containerone',
            'config' => [
                'type' => 'select',
                'renderType' => 'selectSingle',
                'items' => [
                    [ 'label' => 'Break', 'value' => 'break'],
                    [ 'label' => 'No break', 'value' => 'nobreak'],
                ],
            ],
        ],
    ];

    $GLOBALS['TCA']['tt_content']['palettes']['containerbase_palette'] = [
        'showitem' => implode(';,--linebreak--,', array_keys($columns)),
    ];

    ExtensionManagementUtility::addTCAcolumns('tt_content', $columns);
})();
