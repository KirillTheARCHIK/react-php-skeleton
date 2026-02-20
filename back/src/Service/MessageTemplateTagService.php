<?php

namespace App\Service;

use App\Attribute\MessageTemplateTag;
use Doctrine\ORM\EntityManagerInterface;
use App\Service\Utility\AttributeHelper;

readonly class MessageTemplateTagService
{
    public function __construct(private EntityManagerInterface $em)
    {
    }

    public function getAvailableTags(): array
    {
        $availableTags = [];
        $methodList = [];
        $metadata = $this->em->getMetadataFactory()->getAllMetadata();
        foreach ($metadata as $entity) {
            $entityName = $entity->getName();
            $class = new \ReflectionClass($entityName);
            $methodList = array_merge($methodList, $class->getMethods());
        }
        foreach ($methodList as $method) {
            /** @var MessageTemplateTag $annotation */
            $annotation = AttributeHelper::getAttribute($method, MessageTemplateTag::class);
            if ($annotation) {
                $availableTags[] = $annotation->asArray();
            }
        }

        return $availableTags;
    }
}
