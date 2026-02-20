<?php

namespace App\Service\Manager;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;

abstract class AbstractManager
{
    abstract public static function getStatusMap(): array;

    public function __construct(
        readonly protected EntityManagerInterface   $entityManager,
        readonly protected EventDispatcherInterface $dispatcher,
    ) {
    }
    protected function checkCondition($entity, string $status): bool
    {
        if (!isset(static::getStatusMap()[$entity->getStatus()->getSlug()])) {
            return false;
        }

        return in_array($status, static::getStatusMap()[$entity->getStatus()->getSlug()]);
    }
}
