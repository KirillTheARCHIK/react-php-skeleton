<?php

namespace App\Service\Entity;

use App\Attribute\ExportColumn;
use App\Controller\Builder\AbstractCatalogController;
use App\Service\Doctrine\DoctrineMasterEntityService;
use App\Service\Security\RoleManager;
use App\Service\Utility\AttributeHelper;
use App\Service\Utility\EntityHelper;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Serializer\SerializerInterface;

class DataService
{
    public function __construct(
        protected RoleManager                 $roleManager,
        protected SerializerInterface         $serializer,
        protected DoctrineMasterEntityService $entityService,
        protected EntityManagerInterface      $manager,
    ) {
    }

    public function getMetadata(string $objectName): array
    {
        if (!$this->isGrant($objectName)) {
            throw new NotFoundHttpException(
                "Запрашиваемый ресурс не найден в ролевой модели. Он не существует, либо у вас нет доступа. ",
            );
        }

        $controller = $this->getObjectController($objectName);
        $entityName = $this->getEntityByObjectName($controller);
        $classMetadata = $this->manager->getClassMetadata($entityName);

        $jsonDoc = [];
        $classRef = $classMetadata->getReflectionClass();
        $properties = $classRef->getProperties();
        foreach ($properties as $property) {
            $name = $property->getName();

            $type = $property->getType();
            $title = null;

            /** @var ?Groups */
            $annotation = AttributeHelper::getAttribute($property, Groups::class);
            if (!$annotation) {
                continue;
            }

            if (!in_array('View', $annotation->groups)) {
                continue;
            }


            if ($type) {
                $type = $type->getName();
            }

            if (!$type) {
                $phpDoc = $property->getDocComment();
                if (preg_match('/@var\s+(\S+)/', $phpDoc, $matches)) {
                    list(, $type) = $matches;
                }
            }

            if ($classMetadata->hasAssociation($name)) {
                $type = 'int';
            }

            if ($classMetadata->isCollectionValuedAssociation($name)) {
                $type = 'array';
            }

            //Try to get title from Doctrine Annotation
            if ($classMetadata->hasField($name)) {
                $mapping = $classMetadata->getFieldMapping($name);
                if (isset($mapping['options'])) {
                    $title = $mapping['options']['comment'];

                }
            }

            //Try to get title from ExportEntity Annotation
            if (!$title) {
                $annotation = AttributeHelper::getAttribute($property, ExportColumn::class);
                if ($annotation) {
                    $title = $annotation->title;
                }

            }

            $jsonDoc[$name]['type'] = $type;
            $jsonDoc[$name]['title'] = $title;

        }

        return $jsonDoc;
    }

    private function isGrant(string $objectName): bool
    {
        $roles = $this->roleManager->getAvailableRolesByCurrentUser();
        $objects = array_map(fn ($item) => $item['key'], $roles);
        return in_array($objectName, $objects);
    }


    public function getData(string $objectName, Request $request, bool $checkGrants = true): ?array
    {
        if (!$this->isGrant($objectName) && $checkGrants) {
            throw new NotFoundHttpException(
                "Запрашиваемый ресурс не найден в ролевой модели. Он не существует, либо у вас нет доступа. ",
            );
        }

        $controller = $this->getObjectController($objectName);

        if($controller) {
            $entityName = $this->getEntityByObjectName($controller);
        } else {
            $entityNameRef = EntityHelper::getEntityBySlug($objectName);
            if($entityNameRef) {
                $entityName = $entityNameRef->getName();
            }
        }

        if(!$entityName) {
            throw new NotFoundHttpException("Не вышло вычислить сущность");
        }



        return [
            'rows' => $this->entityService->getDataByRequestQueryString(
                $entityName,
                $request,
            ),
            'entityName' => $entityName,
        ];
    }

    private function getEntityByObjectName(string $controller)
    {
        $method = new \ReflectionMethod($controller, 'getEntityName');
        return $method->invoke(null);
    }

    private function getObjectController(string $objectName): ?string
    {
        $controllers = $this->roleManager->getAllAppControllers();

        $objectController = null;
        foreach ($controllers as $controller) {
            $name = $this->roleManager->extractName($controller);
            if (!$name) {
                continue; //Это не AbstractCatalogController и не CustomNamedController
            }
            $key = EntityHelper::getEntitySlug(new \ReflectionClass($name));
            if ($key === $objectName) {
                $objectController = $controller;
                break;
            }
        }

        if (!$objectController) {
            return null;
        }

        if ($interfaces = class_implements($objectController) and in_array(AbstractCatalogController::class, $interfaces)) {
            throw new NotFoundHttpException("Запрашиваемый ресурс не имеет поддерживаемый тип.");
        }

        return $objectController;
    }


}
