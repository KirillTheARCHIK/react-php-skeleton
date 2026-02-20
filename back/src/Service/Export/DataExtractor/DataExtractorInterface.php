<?php

namespace App\Service\Export\DataExtractor;

use Doctrine\ORM\QueryBuilder;

interface DataExtractorInterface
{
    public function getPaginatedData(
        string       $entityName,
        int          $page,
        int          $limit,
        QueryBuilder $queryBuilder,
        array        $context = []
    ): array;

    public function getHeaders(string $entityName): array;

    public function getValuesCount(string $entityName): int;
}
