<?php

namespace App\Service\Export\Builder;

interface BuilderInterface
{
    public function build($model): ?string;

    public static function supports(string $type);
}
