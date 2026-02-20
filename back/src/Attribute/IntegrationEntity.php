<?php

namespace App\Attribute;

#[\Attribute]
class IntegrationEntity
{
    public function __construct(
        public string $mapping
    ) {
    }
}
