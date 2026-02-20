<?php

namespace App\Service\Export\DataExtractor;

use App\Attribute\ExportColumn;
use App\Attribute\ExportEntity;
use App\Service\Doctrine\DoctrineJsonFormatHelper;
use App\Service\Doctrine\DoctrineMasterEntityService;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\QueryBuilder;
use App\Service\Utility\AttributeHelper;

class CatalogDataExtractor implements DataExtractorInterface
{
    public const FILTER = 'filter_data_extractor';
    public const SORT_COLUMN = 'sort_column_data_extractor';
    public const SORT_DESTINATION = 'sort_destination_data_extractor';

    public function __construct(
        protected EntityManagerInterface $manager,
        protected DoctrineMasterEntityService $entityService
    ) {
    }

    public function getPaginatedData(
        string       $entityName,
        int          $page,
        int          $limit,
        QueryBuilder $queryBuilder,
        array        $context = []
    ): array {
        $headers = $this->getHeaders($entityName);
        $select = $this->getSelectByHeaders($headers);
        $queryBuilder->select($select);

        $query = $this->entityService->getQueryByRequestQueryString(
            $entityName,
            $page,
            $limit,
            $context[self::FILTER] ?? null,
            $context[self::SORT_COLUMN] ?? null,
            $context[self::SORT_DESTINATION] ?? null,
            $queryBuilder
        );

        return $query->getScalarResult();
    }

    /**
     * @throws \ReflectionException
     * @throws \Exception
     */
    public function getHeaders(string $entityName): array
    {
        $class = new \ReflectionClass($entityName);
        $properties = $class->getProperties();
        $classMetadata = [];
        /** @var ExportEntity $exportEntityAnnotation */
        $exportEntityAnnotation = AttributeHelper::getAttribute($class, ExportEntity::class);
        $classMetadata['name'] = $exportEntityAnnotation->title;
        $renameTitles = $exportEntityAnnotation->rename;
        $meta = $this->manager->getClassMetadata($entityName);
        $associations = $meta->getAssociationNames();
        foreach ($properties as $property) {
            /** @var ExportColumn $annotation */
            $annotation = AttributeHelper::getAttribute($property, ExportColumn::class);
            if (!$annotation) {
                continue;
            }
            if (in_array($property->getName(), $associations, true)) {
                throw new \Exception('Невозможно экспортировать ассоциативную связь справочника');
            }
            $title = $renameTitles[$property->getName()] ?? $annotation->title;
            $classMetadata['columns'][] = [
                'name' => $title,
                'property' => $property->getName(),
                'metadata' => $meta->getFieldMapping($property->getName()),
            ];
        }

        return $classMetadata;
    }

    public function getValuesCount(string $entityName): int
    {
        $persister = $this->manager->getUnitOfWork()->getEntityPersister($entityName);

        return $persister->count();
    }

    public function getSelectByHeaders(array $headers): array
    {
        return array_map(function ($item) {
            if ('json' === $item['metadata']['type']) {
                return DoctrineJsonFormatHelper::getExportField($item['metadata']);
            }

            return 'a.' . $item['property'];
        }, $headers['columns']);
    }
}
