<?php

namespace App\Service\Doctrine;

use Doctrine\ORM\QueryBuilder;
use Doctrine\ORM\Mapping\FieldMapping;

class DoctrineQueryHelper
{
    /**
     * @param mixed $value
     *
     * @return void
     */
    public static function equal(string $field, $value, QueryBuilder $queryBuilder, $alias = 'a')
    {
        $param = sprintf('%sField', $field);
        $queryBuilder->andWhere(sprintf('%s.%s = :%s', $alias, $field, $param));
        $queryBuilder->setParameter($param, $value);
    }

    public static function in(string $field, array $value, QueryBuilder $queryBuilder, $alias = 'a')
    {
        $expr = $queryBuilder->expr();
        $queryBuilder->andWhere($expr->in(
            sprintf('%s.%s', $alias, $field),
            $value
        ));
    }

    public static function like(
        string $field,
        string $value,
        QueryBuilder $queryBuilder,
        bool $strict = true,
        string $alias = 'a'
    ): void {
        $expr = $queryBuilder->expr();
        $normalizedValue = mb_strtolower($value);
        $normalizedValue = "%$normalizedValue%";
        $param = uniqid('field');
        if ($strict) {
            $normalizedValue = strtolower($normalizedValue);
            $queryBuilder->andWhere($expr->like(sprintf('LOWER(%s.%s)', $alias, $field), sprintf(':%s', $param)));
        } else {
            $queryBuilder->orWhere($expr->like($field, sprintf(':%s', $param)));
        }
        $queryBuilder->setParameter($param, $normalizedValue);
    }

    /**
     * @return void
     *
     * @throws \Exception
     */
    public static function dateRange(string $field, array $value, QueryBuilder $queryBuilder, $alias = 'a')
    {
        $date1 = sprintf('%sStart', $field);
        $date2 = sprintf('%sEnd', $field);
        if (isset($value['start'])) {
            $startDate = $value['start'] ? new \DateTime($value['start']) : new \DateTime();
            $queryBuilder->andWhere(sprintf('%s.%s >= :%s', $alias, $field, $date1));
            $queryBuilder->setParameter($date1, $startDate);
        }
        if (isset($value['end'])) {
            $endDate = $value['end'] ? new \DateTime($value['end']) : new \DateTime();
            $queryBuilder->andWhere(sprintf('%s.%s <= :%s', $alias, $field, $date2));
            $queryBuilder->setParameter($date2, $endDate);
        }
    }

    public static function isNull(string $field, QueryBuilder $queryBuilder, $alias = 'a')
    {
        $expr = $queryBuilder->expr();
        $queryBuilder->andWhere($expr->isNull(sprintf('%s.%s', $alias, $field)));
    }

    public static function isNotNull(string $field, QueryBuilder $queryBuilder, $alias = 'a')
    {
        $expr = $queryBuilder->expr();
        $queryBuilder->andWhere($expr->isNotNull(sprintf('%s.%s', $alias, $field)));
    }

    public static function jsonLike(
        FieldMapping $fieldMetadata,
        string $value,
        QueryBuilder $queryBuilder,
        bool $strict = true,
        string $alias = 'a'
    ): void {
        $param = uniqid('field');
        $normalizedValue = '%'.mb_strtolower($value).'%';
        $normalizedValue = "%$normalizedValue%";
        $filterExp = DoctrineJsonFormatHelper::getFilterExpression($fieldMetadata, $param, $queryBuilder, $alias);
        if ($strict) {
            $queryBuilder->andWhere($filterExp);
        } else {
            $queryBuilder->orWhere($filterExp);
        }
        $queryBuilder->setParameter($param, $normalizedValue);
    }

    public static function numberRange(string $field, array $value, QueryBuilder $queryBuilder, $alias = 'a'): void
    {
        $startParam = sprintf('%sStart', $field);
        $endParam = sprintf('%sEnd', $field);
        if (isset($value['start'])) {
            $start = $value['start'];
            $queryBuilder->andWhere(sprintf('%s.%s >= :%s', $alias, $field, $startParam));
            $queryBuilder->setParameter($startParam, $start);
        }
        if (isset($value['end'])) {
            $end = $value['end'];
            $queryBuilder->andWhere(sprintf('%s.%s <= :%s', $alias, $field, $endParam));
            $queryBuilder->setParameter($endParam, $end);
        }
    }

    public static function relay(string $relationName, string $relationField, $value, QueryBuilder $queryBuilder, $alias = 'a'): void
    {
        $expr = $queryBuilder->expr();
        if (!in_array($relationName, $queryBuilder->getAllAliases())) {
            $queryBuilder->leftJoin($alias.'.'.$relationName, $relationName);
        }
        $queryBuilder
            ->andWhere($expr->eq($relationName.'.'.$relationField, ':fieldValue'))
            ->setParameter('fieldValue', $value);
    }
}
