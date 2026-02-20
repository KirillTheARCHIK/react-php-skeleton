<?php

namespace App\Service\Doctrine;

use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\QueryBuilder;

class DoctrineSortingService
{
    public const DESC_SORT = 'desc';
    public const ASC_SORT = 'asc';

    protected EntityManagerInterface $em;

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    /**
     * @return QueryBuilder
     */
    public function sort(string $entityName, string $column, string $destination, QueryBuilder $queryBuilder)
    {
        if (!in_array(strtolower($destination), [self::DESC_SORT, self::ASC_SORT], true)) {
            throw new \UnexpectedValueException("Не корректное направление сортировки $destination для $column");
        }
        $sortColumn = "a.$column";
        $meta = $this->em->getClassMetadata($entityName);
        if (in_array($column, $meta->getFieldNames(), true)) {
            $fieldMetadata = $meta->getFieldMapping($column);
            if ('json' === $fieldMetadata['type']) {
                $sortColumn = DoctrineJsonFormatHelper::getSortColumn($fieldMetadata);
            }
        }
        $queryBuilder->addOrderBy($sortColumn, $destination);

        return $queryBuilder;
    }
}
