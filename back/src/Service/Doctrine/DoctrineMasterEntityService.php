<?php

namespace App\Service\Doctrine;

use App\Entity\Builder\PositionableEntity;
use App\Service\Doctrine\EntityFilters\EntityFilterInterface;
use App\Service\Doctrine\EntityFilters\EntitySortInterface;
use App\Service\UserSettingService;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Query;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\HttpFoundation\Request;

class DoctrineMasterEntityService
{
    public function __construct(
        private readonly DoctrineFiltrationService $filtrationService,
        private readonly DoctrineSortingService    $sortingService,
        private readonly DoctrinePaginationService $paginationService,
        private readonly SearchServiceInterface    $searchService,
        private readonly EntityManagerInterface    $em,
        private readonly UserSettingService        $userSettingService
    ) {
    }

    public function getDataByRequestQueryString(
        string $entityName,
        Request $request,
        QueryBuilder $queryBuilder = null,
        EntityFilterInterface $filter = null,
        EntitySortInterface $entitySort = null,
    ): array {
        $filters = $this->em->getFilters();
        $filters->getFilter('softdeleteable')->addEnabled($entityName);
        if (null === $queryBuilder) {
            $queryBuilder = $this->em->getRepository($entityName)->createQueryBuilder('a');

            $meta = $this->em->getClassMetadata($entityName);
            if ($meta->hasField(PositionableEntity::POSITION_FIELD)) {
                $queryBuilder
                    ->orderBy('a.' . PositionableEntity::POSITION_FIELD, 'DESC');
            }
        }
        // Filtration
        $where = $request->get('where', []);
        $whereFiltered = $filter instanceof EntityFilterInterface ? $filter->filter($where, $queryBuilder) : [];
        foreach ($whereFiltered as $key => $value) {
            if (array_key_exists($key, $where)) {
                unset($where[$key]);
            }
        }
        $this->filtrationService->filter($entityName, $where, $queryBuilder);
        // Search
        $search = $request->get('search');
        $this->searchService->search($entityName, $search, $queryBuilder);
        // Sorting
        $sort = $request->get('sort', DoctrineSortingService::DESC_SORT);
        $column = $request->get('column', 'id');
        $sorted = $entitySort instanceof EntitySortInterface && $entitySort->sort($column, $sort, $queryBuilder);
        if (!$sorted) {
            $this->sortingService->sort($entityName, $column, $sort, $queryBuilder);
        }
        // Pagination
        $page = $request->get('page', DoctrinePaginationService::DEFAULT_PAGE);


        $limit = $request->get(UserSettingService::LIMIT, $this->userSettingService->getValue(UserSettingService::LIMIT, DoctrinePaginationService::DEFAULT_LIMIT));

        return $this->paginationService->getPagination($queryBuilder, $page, $limit);
    }

    public function getQueryByRequestQueryString(
        string $entityName,
        int $page,
        int $limit,
        ?array $where = [],
        ?string $column = 'id',
        ?string $sort = DoctrineSortingService::ASC_SORT,
        QueryBuilder $queryBuilder = null
    ): Query {
        if (null === $queryBuilder) {
            $queryBuilder = $this->em->getRepository($entityName)->createQueryBuilder('a');
        }

        if ($where) {
            $this->filtrationService->filter($entityName, $where, $queryBuilder);
        }

        if ($column) {
            $sort ??= DoctrineSortingService::ASC_SORT;
            $this->sortingService->sort($entityName, $column, $sort, $queryBuilder);
        }

        return $this->paginationService->getPaginator($queryBuilder, $page, $limit)->getQuery();
    }
}
