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

use Site\Frontend\Service\ContentBlocksService;
use TYPO3\CMS\Core\Domain\Repository\PageRepository;
use TYPO3\CMS\Core\Resource\FileRepository;
use TYPO3\CMS\Core\Site\Entity\SiteInterface;
use TYPO3\CMS\Core\Site\SiteFinder;
use TYPO3\CMS\Frontend\ContentObject\ContentObjectRenderer;
use TYPO3\CMS\Frontend\ContentObject\DataProcessorInterface;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use B13\Menus\DataProcessing\TreeMenu;


class PageProcessor implements DataProcessorInterface
{
    private const COPYRIGHT_YEAR = 2024;

    public function __construct(
        private readonly ContentBlocksService $contentBlocksService,
        private readonly FileRepository $fileRepository,
        private readonly SiteFinder $siteFinder,
        private readonly PageRepository $pageRepository,
        /** @var array<mixed> */
        private array $processedData = [],
    ) {}

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

        $this->processedData = $processedData;

        $pageId = isset($processedData['data']['uid']) && is_numeric($processedData['data']['uid'])
            ? (int)$processedData['data']['uid']
            : 0;

        if ($pageId === 0) {
            return $processedData;
        }

        $site = $this->siteFinder->getSiteByPageId($pageId);

        $this
            ->retrieveLogosBySite($site)
            ->retrieveCtaBySiteRootPage($site)
            ->getStikyCtaByCurrentPageId()
            ->parseCopyright($processedData['data']['site_pagesfooter_copyright'] ?? '')
            ->retrieveFooterLinksBySiteRootPage($site);

        return $this->processedData;
    }

    private function retrieveLogosBySite(SiteInterface $site): self
    {
        $data = $this->processedData['data'] ?? [];
        if (!is_array($data)) {
            return $this;
        }

        foreach (['site_pagesheader_logo', 'site_pagesheader_logo_negative'] as $key) {
            $files = $this->fileRepository->findByRelation('pages', $key, $site->getRootPageId());
            if (isset($files[0])) {
                $data[$key] = $files[0];
            }
        }

        $this->processedData['data'] = $data;

        return $this;
    }

    private function retrieveCtaBySiteRootPage(SiteInterface $site): self
    {
        $data = $this->processedData['data'] ?? [];
        if (!is_array($data)) {
            return $this;
        }

        $rootPage = $this->pageRepository->getPage($site->getRootPageId());

        foreach (['cta_headline', 'cta_subline', 'cta_link'] as $key) {
            $key = 'site_pagesheader_' . $key;
            $data[$key] = $rootPage[$key] ?? '';
        }

        $this->processedData['data'] = $data;

        return $this;
    }

    private function getStikyCtaByCurrentPageId():self
    {
        $id = $GLOBALS['TSFE']->id;

        $data = $this->processedData['data'] ?? [];
        if (!is_array($data)) {
            return $this;
        }
        $rootPage = $this->pageRepository->getPage($id);

        $key = 'site_pagesheader_stickycta_link';
        $data[$key] = $rootPage[$key] ?? '';
        
        $this->processedData['data'] = $data;
        return $this;
    }

    private function parseCopyright(string $copyright): self
    {
        $data = $this->processedData['data'] ?? [];
        if (!is_array($data)) {
            return $this;
        }

        $year = date('Y');
        if ((int)$year > self::COPYRIGHT_YEAR) {
            $year = self::COPYRIGHT_YEAR . '-' . $year;
        }

        $data['site_pagesfooter_copyright'] = str_replace('{year}', $year, $copyright);

        $this->processedData['data'] = $data;

        return $this;
    }

    private function retrieveFooterLinksBySiteRootPage(SiteInterface $site): self
    {
        $data = $this->processedData['data'] ?? [];
        if (!is_array($data)) {
            return $this;
        }

        $contentObject = GeneralUtility::makeInstance(ContentObjectRenderer::class);

        $processorConfiguration = [
            'entryPoints' => 12,
            'depth' => 2,
            'as' => 'footernavigation',
            'includeNotInMenu' => 0,
        ];
        $processedData = ['data' => $data];

        $menuProcessor = GeneralUtility::makeInstance(TreeMenu::class);
        $processedMenu = $menuProcessor->process($contentObject, [], $processorConfiguration,$processedData);

        if (isset($processedMenu['footernavigation'])) {
            $data['footernavigation'] = $processedMenu['footernavigation'];
        }




        $rootPage = $this->pageRepository->getPage($site->getRootPageId());
        $footerlinks = 'site_pagesfooter_footerlinks';
        $certificates = 'site_pagesfooter_certificates';
        $social = 'site_pagesfooter_socials';

        if (isset($rootPage[$footerlinks]) && is_int($rootPage[$footerlinks])) {
            $collection = $this->contentBlocksService->resolveProcessCollection(
                $footerlinks,
                (int)$rootPage['uid']
            );
            $data[$footerlinks] = $collection;
        }
        if (isset($rootPage[$certificates]) && is_int($rootPage[$certificates])) {
            $collection = $this->contentBlocksService->resolveProcessCollection(
                $certificates,
                (int)$rootPage['uid']
            );
            $data[$certificates] = $collection;
        }
        if (isset($rootPage[$social]) && is_int($rootPage[$social])) {
            $files = $this->fileRepository->findByRelation('pages', $social, $site->getRootPageId());
            if (isset($files[0])) {
                $socialFile = $files[0];
                $socialFileUrl = $socialFile->getPublicUrl();
                $socialFileLink = $socialFile->getProperty('link');
                $socialFileTitle = $socialFile->getProperty('title') ?: 'Social Link';
                $socialFileDescription = $socialFile->getProperty('description') ?: '';
                if (isset($data['footernavigation']) && is_array($data['footernavigation'])) {
                $lastIndex = array_key_last($data['footernavigation']);
                if ($lastIndex !== null) {
                    $data['footernavigation'][$lastIndex]['subpages']['social'] = [
                        'url' => $socialFileUrl,
                        'link' => $socialFileLink,
                        'title' => $socialFileTitle,
                        'description' => $socialFileDescription,
                    ];
                }
            }
            }
        }

        $this->processedData['data'] = $data;

        return $this;
    }
}
