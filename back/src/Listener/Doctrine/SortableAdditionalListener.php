<?php

namespace App\Listener\Doctrine;

use App\Entity\Builder\PositionableEntity;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsDoctrineListener;
use Doctrine\ORM\Event\PreRemoveEventArgs;
use Doctrine\ORM\Events;

//#[AsDoctrineListener(event: Events::preRemove)]
class SortableAdditionalListener
{
    public function preRemove(PreRemoveEventArgs $args): void
    {
        $entity = $args->getObject();

        if (!$entity instanceof PositionableEntity || !property_exists($entity, 'deletedAt')) {
            return;
        }

        $className = get_class($entity);

        $args->getObjectManager()
            ->getRepository($className)
            ->createQueryBuilder('a')
            ->update()
            ->set(
                'a.positionNumber',
                'CASE WHEN a.positionNumber != :position THEN a.positionNumber - 1 ELSE :null END'
            )
            ->where('a.positionNumber >= :position')
            ->setParameter('position', $entity->getPositionNumber())
            ->setParameter('null', null)
            ->getQuery()
            ->execute();
    }
}
