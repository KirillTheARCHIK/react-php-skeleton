<?php

namespace App\Service\Doctrine;

use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\QueryBuilder;

class DoctrineFiltrationService
{
    /**
     * @var EntityManagerInterface
     */
    private $em;

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    public const STRING_TYPE = 'string';
    public const TEXT_TYPE = 'text';
    public const INTEGER_TYPE = 'integer';
    public const FLOAT_TYPE = 'float';
    public const DECIMAL_TYPE = 'decimal';
    public const DATE_TYPE = 'date';
    public const TIME_TYPE = 'time';
    public const DATETIME_TYPE = 'datetime';
    public const BOOLEAN_TYPE = 'boolean';
    public const IS_NULL_TYPE = 'null';
    public const IS_NOT_NULL_TYPE = 'notnull';
    public const JSON_TYPE = 'json';
    public const ARRAY_TYPE = 'array';
    public const SIMPLE_ARRAY_TYPE = 'simple_array';
    public const RELAY_TYPE = 'relay';

    /**
     * @return QueryBuilder
     *
     * @throws \Doctrine\ORM\Mapping\MappingException
     */
    public function filter(string $entityName, array $where, QueryBuilder $queryBuilder)
    {
        $metadata = $this->em->getClassMetadata($entityName);

        foreach ($where as $fieldName => $value) {
            $parts = explode('.', $fieldName);
            $value ??= self::IS_NULL_TYPE;
            if (!in_array($value, [self::IS_NOT_NULL_TYPE, self::IS_NULL_TYPE])) {
                if (in_array($fieldName, $metadata->getAssociationNames())) {
                    $fieldMetadata['type'] = self::INTEGER_TYPE;
                } elseif (!empty($parts) && isset($parts[1]) && in_array($parts[0], $metadata->getAssociationNames())) {
                    $fieldMetadata['type'] = self::RELAY_TYPE;
                } elseif (is_array($value) && !(isset($value['start']) || isset($value['end']))) {
                    $fieldMetadata['type'] = self::ARRAY_TYPE;
                } else {
                    $fieldMetadata = $metadata->getFieldMapping($fieldName);
                }
            } else {
                $fieldMetadata['type'] = $value;
            }

            try {
                $fieldType = $fieldMetadata['type'];
                switch ($fieldType) {
                    case self::STRING_TYPE:
                    case self::TEXT_TYPE:
                        DoctrineQueryHelper::like($fieldName, $value, $queryBuilder);
                        break;
                    case self::INTEGER_TYPE:
                    case self::FLOAT_TYPE:
                    case self::DECIMAL_TYPE:
                        is_array($value)
                            ? DoctrineQueryHelper::numberRange($fieldName, $value, $queryBuilder)
                            : DoctrineQueryHelper::equal($fieldName, $value, $queryBuilder);
                        break;
                    case self::BOOLEAN_TYPE:
                        DoctrineQueryHelper::equal($fieldName, $value, $queryBuilder);
                        break;
                    case self::DATE_TYPE:
                    case self::TIME_TYPE:
                    case self::DATETIME_TYPE:
                        DoctrineQueryHelper::dateRange($fieldName, $value, $queryBuilder);
                        break;
                    case self::IS_NOT_NULL_TYPE:
                        DoctrineQueryHelper::isNotNull($fieldName, $queryBuilder);
                        break;
                    case self::IS_NULL_TYPE:
                        DoctrineQueryHelper::isNull($fieldName, $queryBuilder);
                        break;
                    case self::ARRAY_TYPE:
                    case self::SIMPLE_ARRAY_TYPE:
                        DoctrineQueryHelper::in($fieldName, $value, $queryBuilder);
                        break;
                    case self::RELAY_TYPE:
                        DoctrineQueryHelper::relay($parts[0], $parts[1], $value, $queryBuilder);
                        break;
                    case self::JSON_TYPE:
                        DoctrineQueryHelper::jsonLike($fieldMetadata, $value, $queryBuilder);
                        // no break
                    default:
                        break;
                }
            } catch (\Exception $exception) {
                throw new \InvalidArgumentException($exception->getMessage(), $exception->getCode(), $exception);
            }
        }

        return $queryBuilder;
    }
}
