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

use Site\Frontend\Controller\PersonController;
use Site\Frontend\Controller\JobAdvertisementController;
use Site\Frontend\Controller\AjaxController;
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

$GLOBALS['TYPO3_CONF_VARS']['SC_OPTIONS']['t3lib/class.t3lib_tcemain.php']['processDatamapClass'][] = \Site\Frontend\hooks\DataHandlerTranslationHook::class;

(static function () {
    $GLOBALS['TYPO3_CONF_VARS']['RTE']['Presets']['custom'] = 'EXT:site_frontend/Configuration/Yaml/RTE.yaml';
    $GLOBALS['TYPO3_CONF_VARS']['SYS']['fluid']['namespaces']['site'] = [
        'Site\\Frontend\\ViewHelpers',
    ];

    ExtensionUtility::configurePlugin(
        'SiteFrontend',
        'Person',
        [PersonController::class => 'show'],
        [PersonController::class => 'show'],
        ExtensionUtility::PLUGIN_TYPE_PLUGIN,
    );
    ExtensionUtility::configurePlugin(
        'SiteFrontend',
        'JobAdvertisement',
        [JobAdvertisementController::class => 'show'],
        [JobAdvertisementController::class => 'show'],
        ExtensionUtility::PLUGIN_TYPE_PLUGIN,
    );
    ExtensionUtility::configurePlugin(
        'SiteFrontend',
        'AjaxList',
        [AjaxController::class => 'show'],
        [AjaxController::class => 'show'],
        ExtensionUtility::PLUGIN_TYPE_PLUGIN,
    );
})();
