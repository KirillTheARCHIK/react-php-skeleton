<?php

namespace App\Repository;

use App\Entity\User;
use App\Entity\Integration\Contractor;
use App\Entity\Integration\Subdivision;
use App\Entity\TechTaxi\TransportationParticipant;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\QueryBuilder;
use Symfony\Bridge\Doctrine\Security\User\UserLoaderInterface;

class UserRepository extends EntityRepository implements UserLoaderInterface
{
    public function loadUserByIdentifier(string $identifier): ?User
    {
        return $this->createQueryBuilder('u')
            ->where('u.loginLc = :identifier')
            ->setParameter('identifier', strtolower($identifier))
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function checkUniqueLogin($data)
    {
        $query = $this->createQueryBuilder('u')
            ->where('u.loginLc = :login')
            ->setParameter('login', strtolower($data['login']));

        return $query->getQuery()->getResult();
    }

    public function getQueryBuilderByContractor(
        Contractor $contractor,
        QueryBuilder $queryBuilder = null
    ): QueryBuilder {
        if (null === $queryBuilder) {
            $queryBuilder = $this->createQueryBuilder('a');
        }
        $queryBuilder
            ->andWhere('a.organization = :contractor')
            ->setParameter('contractor', $contractor);

        return $queryBuilder;
    }

    public function getUsersByTypes(array $types, QueryBuilder $queryBuilder = null): QueryBuilder
    {
        if (null === $queryBuilder) {
            $queryBuilder = $this->createQueryBuilder('a');
        }

        return $queryBuilder
            ->where('a.roles IN (:suitableTypes)')
            ->setParameters([
                'suitableTypes' => $types
            ]);
    }

    public function getUserByParticipantAndType(TransportationParticipant $participant, array $types, QueryBuilder $queryBuilder = null): QueryBuilder
    {
        if (null === $queryBuilder) {
            $queryBuilder = $this->createQueryBuilder('a');
        }

        return $queryBuilder
            ->innerJoin('a.participant', 'participant')
            ->innerJoin('a.type', 'type')
            ->where('a.participant = :participant')
            ->andWhere('type.slug IN (:types)')
            ->setParameters([
                'participant' => $participant,
                'types' => $types
            ]);
    }

    public function getUserBySubdivisionAndType(Subdivision $subdivision, array $types, QueryBuilder $queryBuilder = null): QueryBuilder
    {
        if (null === $queryBuilder) {
            $queryBuilder = $this->createQueryBuilder('a');
        }

        return $queryBuilder
            ->innerJoin('a.subdivision', 'subdivision')
            ->where('a.subdivision = :subdivision')
            ->andWhere('a.roles IN (:types)')
            ->setParameters([
                'subdivision' => $subdivision,
                'types' => $types
            ]);
    }

    public function getQueryBuilderByParticipant(
        TransportationParticipant $participant,
        QueryBuilder $queryBuilder = null
    ): QueryBuilder {
        if (null === $queryBuilder) {
            $queryBuilder = $this->createQueryBuilder('a');
        }
        $queryBuilder
            ->leftJoin('a.organizations', 'organization')
            ->andWhere('organization.id = :participant')
            ->setParameter('participant', $participant);

        return $queryBuilder;
    }
}
