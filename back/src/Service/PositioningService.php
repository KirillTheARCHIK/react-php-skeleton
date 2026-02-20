<?php

namespace App\Service;

use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\HttpFoundation\Request;

class PositioningService
{
    public const POSITION_FIELD = 'positionNumber';
    public const INITIAL_POSITION = 0;

    public function __construct(protected EntityManagerInterface $em)
    {
    }

    public function clearPosition(string $className, int $position): void
    {
        $this->em
            ->getRepository($className)
            ->createQueryBuilder('a')
            ->update()
            ->set(
                'a.positionNumber',
                'CASE WHEN a.positionNumber != :position THEN a.positionNumber - 1 ELSE :null END'
            )
            ->where('a.positionNumber >= :position')
            ->setParameter('position', $position)
            ->setParameter('null', null)
            ->getQuery()
            ->execute();
    }

    public function getMaxPosition(string $className): ?int
    {
        $query = $this->em
            ->getRepository($className)
            ->createQueryBuilder('a')
            ->select('MAX(a.positionNumber)');

        return $query->getQuery()->getSingleScalarResult();
    }

    public function getSortQueryBuilder(string $className, Request $request): ?QueryBuilder
    {
        $sortColumn = $request->get('column');

        $builder = $this->em
            ->getRepository($className)
            ->createQueryBuilder('a');

        if (!$sortColumn) {
            $builder->addOrderBy('a.' . self::POSITION_FIELD);
        }

        return $builder;
    }
}
