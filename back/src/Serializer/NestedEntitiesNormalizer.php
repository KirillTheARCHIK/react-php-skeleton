<?php

namespace App\Serializer;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PropertyAccess\PropertyAccessorInterface;
use Symfony\Component\PropertyInfo\PropertyTypeExtractorInterface;
use Symfony\Component\Serializer\Exception\InvalidArgumentException;
use Symfony\Component\Serializer\Mapping\Factory\ClassMetadataFactoryInterface;
use Symfony\Component\Serializer\NameConverter\NameConverterInterface;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

class NestedEntitiesNormalizer implements DenormalizerInterface
{
    public const NESTED_ENTITIES = 'nested_entities';

    public function __construct(
        #[Autowire(service: 'serializer.normalizer.object')] private DenormalizerInterface $objectNormalizer,
        readonly private EntityManagerInterface $em,
    ) {
    }

    public function getSupportedTypes(?string $format): array
    {
        return ['object' => true];
    }

    public function denormalize(mixed $data, string $type, ?string $format = null, array $context = []): mixed
    {
        if (isset($context[self::NESTED_ENTITIES][$type]) && is_array($context[self::NESTED_ENTITIES])) {
            foreach ($context[self::NESTED_ENTITIES] as $class => $identifierField) {
                if ($type == $class) {
                    $entity = null;
                    if (isset($data[$identifierField])) {
                        $identifierFieldValue = $data[$identifierField];
                        $entity = $this->em->getRepository($class)->findOneBy([$identifierField => $identifierFieldValue]);
                    }
                    if ($entity) {
                        $nestedContext = $context;
                        unset($nestedContext[self::NESTED_ENTITIES][$type]);

                        return $this->objectNormalizer->denormalize($data, $type, $format, [AbstractNormalizer::OBJECT_TO_POPULATE => $entity] + $nestedContext);
                    }
                }
            }
        }
        $nestedContext = $context;
        unset($nestedContext[self::NESTED_ENTITIES][$type]);

        return $this->objectNormalizer->denormalize($data, $type, $format, $nestedContext);
    }

    public function supportsDenormalization($data, $type, $format = null, $context = []): bool
    {
        return isset($context[self::NESTED_ENTITIES][$type]);
    }
}
