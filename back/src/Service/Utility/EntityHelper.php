<?php

namespace App\Service\Utility;

use App\Entity\TechTaxi\TransportationPoint;
use Doctrine\Common\Collections\Collection;

class EntityHelper
{
    public static function copyEntityFields(
        object $from,
        object $to,
        bool   $copyNull = true,
        array  $except = ['id', 'deletedAt', 'createdAt', 'updatedAt'],
    ): void {
        $reflect = new \ReflectionClass(get_class($to));
        $properties = $reflect->getProperties();
        foreach ($properties as $property) {
            $propertyName = $property->getName();

            if (in_array($propertyName, $except, true)) {
                continue;
            }

            $setter = 'set' . ucfirst($propertyName);
            $type = $property->getType();
            $getter = 'bool' === $type->getName()
                ? 'is' . ucfirst($propertyName)
                : 'get' . ucfirst($propertyName);

            $value = $from->$getter();
            if ($copyNull || $value !== null) {
                $to->$setter($value);
            }
        }
    }

    public static function setNestedObjectsCollection(
        Collection       $to,
        array|Collection $newElements,
        \Closure         $onElementAdd = null,
    ): void {
        $usedOldElements = [];
        $oldElementsAssoc = [];

        foreach ($to as $element) {
            $usedOldElements[$element->getId()] = false;
            $oldElementsAssoc[$element->getId()] = $element;
        }

        foreach ($newElements as $element) {
            if (isset($usedOldElements[$element->getId()])) {
                $usedOldElements[$element->getId()] = true;
                $oldElementsAssoc[$element->getId()]->applyChanges($element);
            } else {
                !$onElementAdd ?: $onElementAdd($element);
                $to->add($element);
            }
        }

        foreach ($to as $element) {
            if (isset($usedOldElements[$element->getId()]) && $usedOldElements[$element->getId()] === false) {
                $to->removeElement($element);
            }
        }
    }

    public static function getEntitySlug(\ReflectionClass $refEntity): ?string
    {
        $entitySlug = $refEntity->getShortName();

        if (str_ends_with($entitySlug, 'Controller')) {
            $entitySlug = substr($entitySlug, 0, strpos($entitySlug, 'Controller'));
            return strtolower(preg_replace('/(?<!^)[A-Z]/', '_$0', $entitySlug));
        }

        if (str_starts_with($entitySlug, 'View')) {
            return null;
        }

        return strtolower(preg_replace('/(?<!^)[A-Z]/', '_$0', $entitySlug));
    }


    /**
     * Reverse method for getEntitySlug
     * @param string $entitySlug
     * @return \ReflectionClass|null
     * @throws \ReflectionException
     */
    public static function getEntityBySlug(string $entitySlug): ?\ReflectionClass
    {
        $parts = explode("_", $entitySlug);
        $parts = array_map(fn ($item) => ucfirst($item), $parts);
        $entityName = implode('', $parts);

        $classes = array_merge(
            ClassFinder::getClassesInNamespace("App\\Entity"),
            ClassFinder::getClassesInNamespace("App\\Entity\\TechTaxi"),
            ClassFinder::getClassesInNamespace("App\\Entity\\Maths"),
            ClassFinder::getClassesInNamespace("App\\Entity\\Integration"),
        );

        foreach ($classes as $class) {
            if (str_contains($class, $entityName)) {
                return new \ReflectionClass($class);
            }
        }
        return null;
    }
}
