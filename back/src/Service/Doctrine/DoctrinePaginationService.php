<?php

namespace App\Service\Doctrine;

use Doctrine\ORM\QueryBuilder;
use Doctrine\ORM\Tools\Pagination\Paginator;

class DoctrinePaginationService
{
    public const DEFAULT_PAGE = 1;
    public const DEFAULT_LIMIT = 10;

    public function getPagination(QueryBuilder $query, int $page = self::DEFAULT_PAGE, int $limit = self::DEFAULT_LIMIT): array
    {
        $paginator = $this->getPaginator($query, $page, $limit);

        return [
            'total' => count($paginator),
            'entries' => $paginator->getQuery()->getResult(),
        ];
    }

    public function getPaginationEntries(QueryBuilder $query, $page, $limit)
    {
        $paginator = $this->getPaginator($query, $page, $limit);

        return $paginator->getQuery()->getResult();
    }

    public function getPaginator(QueryBuilder $query, $page, $limit): Paginator
    {
        $offset = --$page * $limit;
        $query
            ->setFirstResult($offset)
            ->setMaxResults($limit);

        return new Paginator($query);
    }
}
