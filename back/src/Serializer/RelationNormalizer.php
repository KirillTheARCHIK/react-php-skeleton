<?php

namespace App\Serializer;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

class RelationNormalizer implements NormalizerInterface
{
    public const RELATION_NORMALIZER = 'relation_normalizer';

    public function __construct(private readonly EntityManagerInterface $em)
    {
    }

    public function getSupportedTypes(?string $format): array
    {
        return ['object' => true];
    }

    public function supportsNormalization($data, $format = null, $context = []): bool
    {
        if (is_object($data) and isset($context[self::RELATION_NORMALIZER])) {
            foreach ($context[self::RELATION_NORMALIZER] as $class => $_) {
                if ($data instanceof $class) {
                    return true;
                }
            }
        }

        return false;
    }

    public function normalize($object, $format = null, array $context = []): array
    {
        $uow = $this->em->getUnitOfWork();
        $normalized = [
            'id' => $uow->getSingleIdentifierValue($object),
            'displayName' => strval($object),
        ];

        if (method_exists($object, "getDeletedAt") && null !== $object->getDeletedAt()) {
            $normalized['isDeleted'] = true;
        }

        if (method_exists($object, 'getSlug')) {
            $normalized['slug'] = $object->getSlug();
        }

        return $normalized;
    }
}
