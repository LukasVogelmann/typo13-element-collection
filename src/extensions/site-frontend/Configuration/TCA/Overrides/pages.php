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

defined('TYPO3') || die();

(static function () {
    $tcaColumns = [];
    $columns = $GLOBALS['TCA']['pages']['columns'];

    $columns = array_map(function (string $section) use ($columns, &$tcaColumns) {
        $filteredColumns = array_values(array_filter(array_keys($columns), function ($column) use ($section) {
            return is_string($column) && str_starts_with($column, "site_pages{$section}_");
        }));

        $sectionColumns = array_intersect_key($columns, array_flip($filteredColumns));
        $tcaColumns = array_merge($tcaColumns, $sectionColumns);

        return $sectionColumns;
    }, [
        'Header' => 'header',
        'Footer' => 'footer',
    ]);

    ExtensionManagementUtility::addTCAcolumns('pages', $tcaColumns);

    $tcaString = '';
    foreach ($columns as $section => $sectionColumns) {
        if (mb_strlen($tcaString) > 0) {
            $tcaString .= '
';
        }
        $tcaString .= "--div--;{$section}," . implode(',', array_keys($sectionColumns)) . ',';
    }

    ExtensionManagementUtility::addToAllTCAtypes('pages', $tcaString);
})();
