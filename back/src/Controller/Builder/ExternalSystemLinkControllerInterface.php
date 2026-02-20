<?php

namespace App\Controller\Builder;

use Symfony\Component\HttpFoundation\Response;

interface ExternalSystemLinkControllerInterface
{
    public static function getCustomName(): string;

    public static function getRedirectURL(): string;

    public function getRedirectURLAction(): Response;
}
