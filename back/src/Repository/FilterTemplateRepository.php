<?php

namespace App\Repository;

use App\Entity\FilterTemplate;
use App\Entity\User;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\Query\Expr;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\Security\Core\User\UserInterface;

class FilterTemplateRepository extends EntityRepository
{
    public function getAccessibleFiltersQueryBuilder(UserInterface $user, ?string $catalogSlug = null): QueryBuilder
    {
        if (!$user instanceof User) {
            $user = null;
        }

        $builder = $this->createQueryBuilder('a')
            ->where((new Expr())->orX()->addMultiple([
                'a.public = TRUE',
                'a.author = :user',
                'a.author IS NULL'
            ]))
            ->setParameter('user', $user);

        if ($catalogSlug) {
            $builder->andWhere('a.catalogSlug = :slug')
                ->setParameter('slug', $catalogSlug);
        }

        return $builder;
    }

    public function sameFilterExists(FilterTemplate $entity, bool $new = false): bool
    {
        $builder = $this->createQueryBuilder('a')
            ->select("count(1)")
            ->where('a.catalogSlug = :slug')
            ->andWhere('a.filterName = :name')
            ->andWhere((new Expr())->orX()->addMultiple([
                'a.public = TRUE',
                'a.author = :author',
                'a.author IS NULL'
            ]))
            ->setParameter('slug', $entity->getCatalogSlug())
            ->setParameter('name', $entity->getFilterName())
            ->setParameter('author', $entity->getAuthor());

        if (!$new) {
            $builder
                ->andWhere('a != :entity')
                ->setParameter('entity', $entity);
        }

        return 0 !== $builder->getQuery()->getSingleScalarResult();
    }
}
