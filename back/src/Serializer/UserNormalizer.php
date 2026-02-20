<?php

namespace App\Serializer;

use App\Entity\User;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

class UserNormalizer implements NormalizerInterface
{
    public const COLLAPSE = 'collapse';

    public function getSupportedTypes(?string $format): array
    {
        return [User::class => true];
    }

    public function normalize(mixed $object, ?string $format = null, array $context = []): array|string|int|float|bool|\ArrayObject|null
    {
        //There you can check a context flag
        return $object->getDisplayName();
    }

    public function supportsNormalization(mixed $data, string $format = null, array $context = []): bool
    {
        return isset($context[self::COLLAPSE]) && $context[self::COLLAPSE] && $data instanceof User;
    }
}
