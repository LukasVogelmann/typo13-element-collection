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

$GLOBALS['SiteConfiguration']['site_language']['columns']['gtm_id'] = [
    'label' => 'Google Tag Manager - ID',
    'config' => [
        'type' => 'input',
        'placeholder' => 'GTM-XXXXXXX',
    ],
];

$GLOBALS['SiteConfiguration']['site_language']['palettes']['default']['showitem'] = str_replace(
    'title,',
    'gtm_id, --linebreak--, title, ',
    $GLOBALS['SiteConfiguration']['site_language']['palettes']['default']['showitem'],
);
