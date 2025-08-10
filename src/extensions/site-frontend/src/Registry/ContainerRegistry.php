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

namespace Site\Frontend\Registry;

use B13\Container\Tca\ContainerConfiguration;
use B13\Container\Tca\Registry;
use TYPO3\CMS\Core\Utility\GeneralUtility;

class Container
{
    public function __construct(
        public readonly string $ctype,
        public readonly string $label,
        public readonly string $description,
        /** @var array<int, array<int, array{name: string, colPos: int}>> */
        public readonly array $definitions,
    ) {}
}

class ContainerRegistry
{
    public const PALETTE_APPEND = 0;
    protected int $currentType = self::PALETTE_APPEND;

    /**
     * The default TCA for any registered container.
     *
     * @var array<array<array<string>>>
     */
    protected array $baseTca = [
        'general' => [
            'LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:general' => [
                '--palette--;;general,',
                // '--palette--;;headers,',
            ],
        ],
        'appearance' => [
            'LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:tabs.appearance' => [
                '--palette--;;frames',
                '--palette--;;appearanceLinks',
            ],
        ],
        'language' => [
            'LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:language' => [
                '--palette--;;language',
            ],
        ],
        'access' => [
            'LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:access' => [
                '--palette--;;hidden',
                '--palette--;;access',
            ],
        ],
        'categories' => [
            'LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:categories' => [
                'categories',
            ],
        ],
        'notes' => [
            'LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:notes' => [
                'rowDescription',
            ],
        ],
        'extended' => [
            'LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:extended' => [],
        ],
    ];

    protected Registry $registry;

    public function __construct()
    {
        $this->registry = GeneralUtility::makeInstance(Registry::class);
    }

    /**
     * Adds additional fields for the TCA fields of the default containers provided by EXT:container.
     *
     * @param array<string> $showFields
     */
    public function addFields(string $ctype, array $showFields = [], string $targetedPalette = 'extended'): void
    {
        $baseTca = $this->baseTca;
        $builtTca = '';

        $baseTca[$targetedPalette][key($baseTca[$targetedPalette])] = array_merge(
            $baseTca[$targetedPalette][key($baseTca[$targetedPalette])],
            $showFields
        );

        $size = count($baseTca);
        $i = 0;

        foreach ($baseTca as $name => $paletteFields) {
            $label = key($paletteFields);
            $builtTca .= '                --div--;' . $label . ",\r\n                    ";

            foreach ($paletteFields as $field) {
                $builtTca .= implode(',
                    ', $field);
            }

            if ($i !== ($size - 1)) {
                $builtTca .= ",\r\n";
                ++$i;
            }
        }

        $GLOBALS['TCA']['tt_content']['types'][$ctype]['showitem'] = $builtTca;
    }

    /**
     * Registers the provided configurations for EXT:container.
     * @param array<string> $additionalFields
     * @throws \InvalidArgumentException
     * @throws \RuntimeException
     */
    public function register(Container $container, array $additionalFields = []): void
    {
        $containerConfiguration = new ContainerConfiguration(
            $container->ctype,
            $container->label,
            $container->description,
            $container->definitions,
        );

        $this->registry->configureContainer($containerConfiguration);

        if (!empty($additionalFields)) {
            $this->addFields(
                $container->ctype,
                $additionalFields,
            );
        }
    }
}
