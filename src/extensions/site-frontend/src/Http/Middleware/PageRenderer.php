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

namespace Site\Frontend\Http\Middleware;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use TYPO3\CMS\Core\Page\PageRenderer as T3PageRenderer;
use TYPO3\CMS\Core\Site\Entity\SiteLanguage;

class PageRenderer implements MiddlewareInterface
{
    public function __construct(
        private T3PageRenderer $pageRenderer,
    ) {}

    public function process(
        ServerRequestInterface $request,
        RequestHandlerInterface $handler
    ): ResponseInterface {
        /** @var SiteLanguage */
        $language = $GLOBALS['TSFE']->language;
        $languageCode = $request->getAttribute('language')->getLocale()->getLanguageCode();
        $tagManagerId = $language->toArray()['gtm_id'] ?? '';

        $html = <<<HTML
            <meta name="viewport" content="width=device-width, initial-scale=1">
        HTML;

        if (mb_strlen($tagManagerId) > 0) {
            $html .= <<<HTML
                \n
                <noscript>
                    <iframe src="//www.googletagmanager.com/ns.html?id={$tagManagerId}"height="0" width="0" style="display:none;visibility:hidden"></iframe>
                </noscript>
                <script>dataLayer.push({'tx_googletagmanager_dataLayerVersion': '1'});(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',{$tagManagerId});</script>
            HTML;
        }

        $this->pageRenderer->addHeaderData($html);

        if ($languageCode === 'en') {
            $languageCode = '';
        } else {
            $languageCode .= '.';
        }

        $this->pageRenderer->addInlineLanguageLabelFile('EXT:site_frontend/Resources/Private/Language/' . $languageCode . 'javascript-frontend.xlf');

        return $handler->handle($request);
    }
}
