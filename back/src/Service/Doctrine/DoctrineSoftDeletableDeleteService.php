<?php

namespace App\Service\Doctrine;

use App\Entity\Builder\PositionableEntity;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\QueryBuilder;

class DoctrineSoftDeletableDeleteService implements DoctrineDeleteInterface
{
    protected EntityManagerInterface $em;

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    public function deleteAll($className, QueryBuilder $builder = null): void
    {
        $metaData = $this->em->getClassMetadata($className);
        $time = new \DateTime();
        $fieldNames = $metaData->getFieldNames();

        if (in_array('deletedAt', $fieldNames, true)) {
            if ($builder) {
                $this->applySoftDeletableWithBuilder($builder, $time);
            } else {
                $builder = $this->em->createQueryBuilder();
                $this->applySoftDeletable($builder, $className, $time);
            }
        } else {
            if (null === $builder) {
                $builder = $this->em->createQueryBuilder();
            }
            $builder->delete()->from($className, 'e');
        }
        $this->applyIfExternal($builder, $fieldNames);

        $builder->getQuery()->execute();
    }

    private function applySoftDeletable(QueryBuilder $builder, string $className, \DateTime $time): void
    {
        $builder->update($className, 'e')
            ->set('e.deletedAt', ':time')
            ->where($builder->expr()->isNull('e.deletedAt'))
            ->setParameter('time', $time);
    }

    private function applySoftDeletableWithBuilder(QueryBuilder $builder, \DateTime $time): void
    {
        $builder
            ->update()
            ->set('a.deletedAt', ':time')
            ->setParameter('time', $time);
    }

    private function applyIfPositionable(QueryBuilder $builder, string $className): void
    {
        if (in_array(PositionableEntity::class, class_implements($className), true)) {
            $builder->set('e.positionNumber', ':null')
                ->setParameter('null', null);
        }
    }

    private function applyIfExternal(QueryBuilder $builder, array $fieldNames): void
    {
        if (in_array('externalId', $fieldNames, true)) {
            $builder->andWhere('e.externalId IS NULL');
        }
    }
}
