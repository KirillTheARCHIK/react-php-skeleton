<?php

namespace App\Attribute;

#[\Attribute]
class ExportEntity
{
    public function __construct(
        public string $title,
        public string $type = 'catalog',
        public bool $logOnly = false,
        public array $rename = [],
    ) {
    }
}
