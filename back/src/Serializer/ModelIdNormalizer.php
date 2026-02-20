<?php

namespace App\Serializer;

use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\Proxy;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

class ModelIdNormalizer implements NormalizerInterface
{
    public const PARENT_CLASS = 'parent_class';

    public function __construct(
        private readonly EntityManagerInterface $entityManager,
    ) {
    }

    public function getSupportedTypes(?string $format): array
    {
        return ['object' => true];
    }

    public function normalize(mixed $object, string $format = null, array $context = []): array|string|int|float|bool|\ArrayObject|null
    {
        $uow = $this->entityManager->getUnitOfWork();
        return $uow->getSingleIdentifierValue($object);
    }

    public function supportsNormalization(mixed $data, ?string $format = null, $context = []): bool
    {
        if (
            is_object($data) &&
            isset($context[self::PARENT_CLASS]) &&
            !($data instanceof $context[self::PARENT_CLASS]) &&
            ($data instanceof Proxy || str_contains(get_class($data), "App\Entity"))) {
            return true;
        }
        return false;
    }
}
