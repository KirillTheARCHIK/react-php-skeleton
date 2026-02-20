<?php

namespace App\Attribute;

#[\Attribute]
class ExportColumn
{
    public function __construct(
        public string $title
    ) {
    }
}
