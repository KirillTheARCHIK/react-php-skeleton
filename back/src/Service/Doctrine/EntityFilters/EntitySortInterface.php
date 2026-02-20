<?php

namespace App\Service\Doctrine\EntityFilters;

use Doctrine\ORM\QueryBuilder;

interface EntitySortInterface
{
    public function sort(string $column, string $destination, QueryBuilder $queryBuilder): bool;
}
