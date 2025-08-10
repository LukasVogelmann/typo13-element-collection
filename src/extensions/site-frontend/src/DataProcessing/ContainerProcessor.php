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

namespace Site\Frontend\DataProcessing;

use TYPO3\CMS\Frontend\ContentObject\ContentObjectRenderer;
use TYPO3\CMS\Frontend\ContentObject\DataProcessorInterface;

class ContainerProcessor implements DataProcessorInterface
{
    /**
     * @param ContentObjectRenderer $cObj
     * @param array<string, mixed> $contentObjectConfiguration
     * @param array<string, mixed> $processorConfiguration
     * @param array<string, mixed> $processedData
     * @return array<string, mixed>
     */
    public function process(
        ContentObjectRenderer $cObj,
        array $contentObjectConfiguration,
        array $processorConfiguration,
        array $processedData
    ): array {
        if (!isset($processedData['data']) || !is_array($processedData['data'])) {
            return $processedData;
        }

        $classes = match ($processedData['data']['container_width']) {
            'default' => ['sm-container'],
            'fullsize' => ['sm-container-fullsize'],
            'medium' => ['sm-container-medium'],
            'small' => ['sm-container-small'],

            default => ['sm-container'],
        };

        foreach (['before', 'after'] as $key) {
            $value = $processedData['data']["space_{$key}_class"];

            if (mb_strlen($value) === 0) {
                continue;
            }
            $classes[] = "space-{$key}-{$value}";
        }

        if ($processedData['data']['CType'] === 'site_containertwo') {
            $columnsClasses = match ($processedData['data']['columns_layout']) {
                '50/50' => ['sm-column-tablet-6', 'sm-column-tablet-6'],
                '25/75' => ['sm-column-tablet-3', 'sm-column-tablet-9'],
                '75/25' => ['sm-column-tablet-9', 'sm-column-tablet-3'],
                '33/66' => ['sm-column-tablet-4', 'sm-column-tablet-8'],
                '66/33' => ['sm-column-tablet-8', 'sm-column-tablet-4'],
                default => ['sm-column-tablet-6', 'sm-column-tablet-6'],
            };

            $processedData['data']['columns_layout'] = $columnsClasses;
        }

        $processedData['__containerClasses'] = implode(' ', $classes);
        $processedData['__columnsClasses'] = $processedData['data']['columns_layout'] ?? [];

        return $processedData;
    }
}
