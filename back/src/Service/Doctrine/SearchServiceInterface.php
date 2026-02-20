<?php

namespace App\Service\Doctrine;

use Doctrine\ORM\QueryBuilder;

interface SearchServiceInterface
{
    public function search(string $entityName, $value, QueryBuilder $queryBuilder);
}
