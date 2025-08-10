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
use TYPO3\CMS\Extbase\Utility\ExtensionUtility;

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

defined('TYPO3') || die();

(static function () {
    $pluginSignature = ExtensionUtility::registerPlugin(
        'SiteFrontend',
        'Person',
        'Person',
    );

    $GLOBALS['TCA']['tt_content']['types']['list']['subtypes_addlist'][$pluginSignature] = 'pi_flexform';

    ExtensionManagementUtility::addPiFlexFormValue(
        $pluginSignature,
        'FILE:EXT:site_frontend/Configuration/FlexForms/Person.xml'
    );
})();
(static function () {
    $pluginSignature = ExtensionUtility::registerPlugin(
        'SiteFrontend',
        'JobAdvertisement',
        'JobAdvertisement',
    );

    $GLOBALS['TCA']['tt_content']['types']['list']['subtypes_addlist'][$pluginSignature] = 'pi_flexform';

    ExtensionManagementUtility::addPiFlexFormValue(
        $pluginSignature,
        'FILE:EXT:site_frontend/Configuration/FlexForms/JobAdvertisement.xml'
    );
})();
