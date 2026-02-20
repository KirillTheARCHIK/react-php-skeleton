<?php

namespace App\Service\Doctrine;

use Doctrine\ORM\QueryBuilder;
use Doctrine\ORM\Mapping\FieldMapping;

class DoctrineJsonFormatHelper
{
    public const KEY_VALUE_FORMAT = 'keyValue';

    private static function addAlias(?string $alias, string $column): string
    {
        return $alias ? "$alias.$column" : $column;
    }

    private static function getJsonFormat(FieldMapping $fieldMetadata)
    {
        return $fieldMetadata->options['jsonFormat'] ?? null;
    }

    public static function getSortColumn(FieldMapping $fieldMetadata, $alias = 'a'): string
    {
        $fieldName = $fieldMetadata->fieldName;
        $jsonFormat = self::getJsonFormat($fieldMetadata);
        $column = self::addAlias($alias, $fieldName);
        if (self::KEY_VALUE_FORMAT === $jsonFormat) {
            $sortColumn = "GET_JSON_VALUE($column, 'value')";
        } else {
            $sortColumn = $column;
        }

        return $sortColumn;
    }

    public static function getFilterExpression(
        FieldMapping $fieldMetadata,
        string $valueParam,
        QueryBuilder $queryBuilder,
        string $alias = 'a'
    ) {
        $fieldName = $fieldMetadata->fieldName;
        $jsonFormat = self::getJsonFormat($fieldMetadata);
        $column = self::addAlias($alias, $fieldName);
        if (self::KEY_VALUE_FORMAT === $jsonFormat) {
            $filterBy = $fieldMetadata->options['filterBy'] ?? 'key';
            if (!in_array($filterBy, ['key', 'value', 'both'])) {
                throw new \Exception('Некорректное поле фильтрации по JSON полю');
            }

            if ('both' === $filterBy) {
                $likeKey = $queryBuilder->expr()->like(
                    "LOWER(GET_JSON_VALUE($column, 'key'))",
                    sprintf(':%s', $valueParam)
                );
                $likeValue = $queryBuilder->expr()->like(
                    "LOWER(GET_JSON_VALUE($column, 'value'))",
                    sprintf(':%s', $valueParam)
                );
                $filterExpression = $queryBuilder->expr()->orX($likeKey, $likeValue);
            } else {
                $filterExpression = $queryBuilder->expr()->like(
                    "LOWER(GET_JSON_VALUE($column, '$filterBy'))",
                    sprintf(':%s', $valueParam)
                );
            }
        } else {
            $filterExpression = $queryBuilder->expr()->like(
                "LOWER(TEXT($column))",
                sprintf(':%s', $valueParam)
            );
        }

        return $filterExpression;
    }

    public static function getSearchExpression(
        FieldMapping $fieldMetadata,
        string $valueParam,
        QueryBuilder $queryBuilder,
        string $alias = 'a'
    ) {
        $fieldName = $fieldMetadata['fieldName'];
        $jsonFormat = self::getJsonFormat($fieldMetadata);
        $column = self::addAlias($alias, $fieldName);
        if (self::KEY_VALUE_FORMAT === $jsonFormat) {
            $filterExpression = $queryBuilder->expr()->like(
                "LOWER(GET_JSON_VALUE($column, 'value'))",
                sprintf(':%s', $valueParam)
            );
        } else {
            $filterExpression = $queryBuilder->expr()->like(
                "LOWER(TEXT($column))",
                sprintf(':%s', $valueParam)
            );
        }

        return $filterExpression;
    }

    public static function getGroupField(FieldMapping $fieldMetadata, string $alias = 'a'): string
    {
        $fieldName = $fieldMetadata['fieldName'];
        $jsonFormat = self::getJsonFormat($fieldMetadata);
        $column = self::addAlias($alias, $fieldName);
        if (self::KEY_VALUE_FORMAT === $jsonFormat) {
            $groupField = "GET_JSON_VALUE($column, 'key')";
        } else {
            $groupField = $column;
        }

        return $groupField;
    }

    public static function getExportField(FieldMapping $fieldMetadata, string $alias = 'a'): string
    {
        $fieldName = $fieldMetadata['fieldName'];
        $jsonFormat = self::getJsonFormat($fieldMetadata);
        $column = self::addAlias($alias, $fieldName);
        if (self::KEY_VALUE_FORMAT === $jsonFormat) {
            $exportField = "GET_JSON_VALUE($column, 'value')";
        } else {
            $exportField = $column;
        }

        return $exportField;
    }
}
