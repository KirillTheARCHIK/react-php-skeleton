<?php

namespace App\Attribute;

#[\Attribute]
class IgnoreFilter
{
    public function __construct(
        public string $filter,
        public array $forClasses = [],
    ) {
    }
}
