<?php

namespace App\Service;

use App\Attribute\ExportEntity;
use App\Model\CatalogInformationModel;
use App\Service\Utility\AttributeHelper;
use App\Service\Utility\EntityHelper;
use Doctrine\ORM\EntityManagerInterface;

class CatalogService
{
    public function __construct(protected EntityManagerInterface $em)
    {
    }

    /**
     * @return CatalogInformationModel[]
     */
    public function getCatalogList(): array
    {
        static $catalogList;

        if (isset($catalogList)) {
            return $catalogList;
        }

        $catalogList = [];
        $metadata = $this->em->getMetadataFactory()->getAllMetadata();
        foreach ($metadata as $entity) {
            $class = $entity->getReflectionClass();
            $entitySlug = EntityHelper::getEntitySlug($class);
            if (!$entitySlug) {
                continue;
            }

            $annotation = AttributeHelper::getAttribute($class, ExportEntity::class);
            if (!$annotation) {
                continue;
            }
            $entityName = $annotation->title;

            $catalogInfo = new CatalogInformationModel();
            $catalogInfo->setSlug($entitySlug);
            $catalogInfo->setName($entityName);

            $catalogList[$entitySlug] = $catalogInfo;
        }
        return $catalogList;
    }

    public function getCatalogName($catalogSlug): ?string
    {
        $catalogList = $this->getCatalogList();

        /** @var CatalogInformationModel $catalogInfo */
        $catalogInfo = $catalogList[$catalogSlug] ?? null;

        return $catalogInfo?->getName();
    }

    public function findCatalogInfo(string $catalogSlug): ?CatalogInformationModel
    {
        $catalogList = $this->getCatalogList();

        return $catalogList[$catalogSlug] ?? null;
    }
}
