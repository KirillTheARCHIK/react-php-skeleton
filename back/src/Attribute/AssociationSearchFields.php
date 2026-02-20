<?php

namespace App\Attribute;

#[\Attribute]
class AssociationSearchFields
{
    public function __construct(
        public array $searchFields
    ) {
    }
}
