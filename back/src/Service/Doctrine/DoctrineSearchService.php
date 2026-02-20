<?php

namespace App\Service\Doctrine;

use App\Attribute\AssociationSearchFields;
use App\Extension\Doctrine\DateFormat;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Mapping\ClassMetadata;
use Doctrine\ORM\Query\Parameter;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\Serializer\Attribute\Groups;
use App\Service\Utility\AttributeHelper;
use Doctrine\ORM\Mapping\FieldMapping;
use Doctrine\ORM\Mapping\AssociationMapping;

class DoctrineSearchService implements SearchServiceInterface
{
    /**
     * @var EntityManagerInterface
     */
    private $em;

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    /**
     * @param mixed $value
     *
     * @return void
     */
    public function search(string $entityName, $value, QueryBuilder $queryBuilder)
    {
        if ($value) {
            $metadata = $this->em->getClassMetadata($entityName);

            $subQuery = $this->em->createQueryBuilder();
            $subQuery->add('select', $queryBuilder->getDQLPart('select'));
            $subQuery->add('from', $queryBuilder->getDQLPart('from'));

            if (is_array($value)) {
                // заданы поля поиска
                $this->searchThroughSpecifiedFields($value, $metadata, $subQuery);
                $this->searchThroughSpecifiedAssociations($value, $metadata, $subQuery);
            } else {
                // ищем по всем полям
                $this->searchThroughFields($value, $metadata, $subQuery);
                $this->searchThroughAssociations($value, $metadata, $subQuery);
            }

            if (isset($subQuery->getDQLPart('join')['a'])) {
                $joins = $queryBuilder->getDQLPart('join');
                foreach ($subQuery->getDQLPart('join')['a'] as $newJoin) {
                    $joins['a'][] = $newJoin;
                }
                $queryBuilder->add('join', $joins);
            }

            $queryBuilder->andWhere($subQuery->getDQLPart('where'));
            /** @var Parameter $parameter */
            foreach ($subQuery->getParameters() as $parameter) {
                $queryBuilder->setParameter($parameter->getName(), $parameter->getValue());
            }
        }
    }

    private function searchThroughSpecifiedFields($value, ClassMetadata $metaData, QueryBuilder $queryBuilder): void
    {
        $fields = array_keys($value);
        foreach ($metaData->fieldMappings as $fieldMetadata) {
            if (in_array($fieldMetadata->fieldName, $fields)) {
                $this->setDqlPropertyConditions($fieldMetadata, $value[$fieldMetadata->fieldName], $queryBuilder);
            }
        }
    }

    private function searchThroughSpecifiedAssociations($value, ClassMetadata $metaData, QueryBuilder $queryBuilder): void
    {
        $properties = $metaData->getReflectionProperties();
        $fields = array_keys($value);
        foreach ($metaData->associationMappings as $associationMapping) {
            /** @var AssociationSearchFields $annotation */
            $annotation = AttributeHelper::getAttribute($properties[$associationMapping->fieldName], AssociationSearchFields::class);
            if ($annotation) {
                foreach ($annotation->searchFields as $searchField) {
                    if (in_array($associationMapping->fieldName, $fields)) {
                        $this->setDqlAssociationConditions($associationMapping, $searchField, $value[$associationMapping->fieldName], $queryBuilder);
                    }
                }
            }
        }
    }

    /**
     * @return void
     */
    private function searchThroughFields(string $value, ClassMetadata $metaData, QueryBuilder $queryBuilder)
    {
        $properties = $metaData->getReflectionProperties();
        foreach ($metaData->fieldMappings as $fieldMetadata) {
            if (!isset($fieldMetadata->id) && AttributeHelper::getAttribute($properties[$fieldMetadata->fieldName], Groups::class)) {
                $this->setDqlPropertyConditions($fieldMetadata, $value, $queryBuilder);
            }
        }
    }

    /**
     * @return void
     */
    private function searchThroughAssociations(string $value, ClassMetadata $metaData, QueryBuilder $queryBuilder)
    {
        $properties = $metaData->getReflectionProperties();

        foreach ($metaData->associationMappings as $associationMapping) {
            /** @var AssociationSearchFields $annotation */
            $annotation = AttributeHelper::getAttribute($properties[$associationMapping['fieldName']], AssociationSearchFields::class);
            if ($annotation) {
                foreach ($annotation->searchFields as $searchField) {
                    $this->setDqlAssociationConditions($associationMapping, $searchField, $value, $queryBuilder);
                }
            }
        }
    }

    private function setDqlPropertyConditions(FieldMapping $fieldMetadata, string $value, QueryBuilder $queryBuilder): void
    {
        $fieldName = $fieldMetadata->fieldName;
        if (in_array($fieldMetadata->type, ['string', 'text'], true)) {
            DoctrineQueryHelper::like("LOWER(a.$fieldName)", mb_strtolower($value), $queryBuilder, false);
        } elseif (in_array($fieldMetadata->type, ['integer', 'float'], true)) {
            DoctrineQueryHelper::like("LOWER(TEXT(a.$fieldName))", mb_strtolower($value), $queryBuilder, false);
        } elseif (in_array($fieldMetadata->type, ['date', 'datetime', 'time'], true)) {
            $format = DateFormat::getFormat($fieldMetadata);
            DoctrineQueryHelper::like("DATE_FORMAT(a.$fieldName, '$format')", $value, $queryBuilder, false);
        } elseif ('json' === $fieldMetadata->type) {
            DoctrineQueryHelper::jsonLike($fieldMetadata, $value, $queryBuilder, false);
        }
    }

    private function setDqlAssociationConditions(AssociationMapping $associationMapping, string $searchField, string $value, QueryBuilder $queryBuilder): void
    {
        $guidAssociation = uniqid('association');
        $queryBuilder->leftJoin('a.'.$associationMapping->fieldName, $guidAssociation);
        DoctrineQueryHelper::like(sprintf(
            'LOWER(%s)',
            $guidAssociation.'.'.$searchField
        ), $value, $queryBuilder, false);
    }
}
