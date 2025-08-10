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

namespace Site\Frontend\ViewHelpers;

use Site\Frontend\Service\ContentBlocksService;
use TYPO3Fluid\Fluid\Core\ViewHelper\AbstractViewHelper;

final class MenuViewHelper extends AbstractViewHelper
{
    public function __construct(
        protected readonly ContentBlocksService $contentBlocksService,
    ) {}

    public function initializeArguments(): void
    {
        $this->registerArgument('page', 'array', 'Raw page-record row retrieved from `pages` database-table.', true);
    }

    /**
     * @return array<string, mixed>|null
     */
    public function render(): ?array
    {
        /** @var array<string, mixed> $page */
        $page = $this->arguments['page'] ?? [];

        /** @var array<string, mixed> $data */
        $data = $page['data'] ?? [];

        $key = 'site_pagesheader_megamenu_tabs';

        // Ensure $data[$key] is numeric before casting
        if (!isset($data[$key]) || !is_numeric($data[$key]) || (int)$data[$key] === 0) {
            return $page;
        }

        // Ensure $data['uid'] is numeric before casting
        $uid = isset($data['uid']) && is_numeric($data['uid']) ? (int)$data['uid'] : 0;

        if ($uid === 0) {
            return $page;
        }

        $collection = $this->contentBlocksService->resolveProcessCollection(
            $key,
            $uid
        );

        $data[$key] = $collection;
        $page['data'] = $data;

        return $page;
    }
}
