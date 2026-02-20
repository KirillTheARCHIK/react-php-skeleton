<?php

namespace App\Service\Doctrine\EntityFilters;

use Doctrine\ORM\QueryBuilder;

interface EntityFilterInterface
{
    public function filter(array $where, QueryBuilder $queryBuilder);
}
