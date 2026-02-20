<?php

namespace App\Service\Utility;

class AttributeHelper
{
    /**
     * @template T
     * @param class-string<T> $attributeClass Name of an attribute class
     * @return ?T
     */
    public static function getAttribute(
        \ReflectionFunctionAbstract|\ReflectionProperty|\ReflectionClass $reflectionObject,
        string $attributeClass
    ): ?object {
        return array_first($reflectionObject->getAttributes($attributeClass))?->newInstance();
    }
}
