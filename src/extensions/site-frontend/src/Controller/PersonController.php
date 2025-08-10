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

namespace Site\Frontend\Controller;

use Psr\Http\Message\ResponseInterface;
use Site\Frontend\Service\ContentBlocksService;
use TYPO3\CMS\Extbase\Mvc\Controller\ActionController;

class PersonController extends ActionController
{
    private const TABLE_NAME = 'tx_site_persons';

    public function __construct(private readonly ContentBlocksService $contentBlocksService) {}

    public function showAction(): ResponseInterface
    {
        $uid = (int)$this->settings['contact'];

        $contact = $this->contentBlocksService->resolveProcessCollection(
            self::TABLE_NAME,
            $uid,
            'uid'
        );

        $this->view->assign('contact', $contact);

        return $this->htmlResponse();
    }
}
