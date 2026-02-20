<?php

namespace App\Service\Doctrine;

use App\Serializer\RelationNormalizer;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Mapping\MappingException;
use Doctrine\ORM\Query\Expr;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class DoctrineGroupingService
{
    /**
     * @var EntityManagerInterface
     */
    private $em;

    /**
     * @var DoctrinePaginationService
     */
    private $paginationService;

    /**
     * @var DoctrineSortingService
     */
    private $sortingService;

    public function __construct(
        EntityManagerInterface $em,
        DoctrinePaginationService $paginationService,
        DoctrineSortingService $sortingService
    ) {
        $this->em = $em;
        $this->paginationService = $paginationService;
        $this->sortingService = $sortingService;
    }

    /**
     * @param string $destination
     *
     * @return mixed
     *
     * @throws MappingException
     */
    public function getGroupsByField(
        string $className,
        string $columnName,
        int $page,
        int $limit,
        ?string $destination = null,
        QueryBuilder $builder = null
    ) {
        $metadata = $this->em->getClassMetadata($className);
        if (!$builder) {
            $builder = $this->em->getRepository($className)->createQueryBuilder('a');
        }

        $builder->setFirstResult(($page * $limit) - $limit)
            ->setMaxResults($limit);

        if (in_array($columnName, $metadata->getFieldNames(), true)) {
            $builder->select('a.'.$columnName)
                ->addGroupBy('a.'.$columnName);

            if ($destination) {
                $this->sortingService->sort($className, $columnName, $destination, $builder);
            }

            $data = $this->paginationService->getPagination($builder, $page, $limit);

            return [
                'context' => [],
                'data' => $data,
            ];
        } elseif ($metadata->hasAssociation($columnName)) {
            $builder->leftJoin($metadata->getAssociationMapping($columnName)['targetEntity'], 'association', Expr\Join::WITH, "a.$columnName = association")
                ->addGroupBy('association')
                ->select('association');

            $builder->setFirstResult(($page * $limit) - $limit)
                ->setMaxResults($limit);

            $data = $this->paginationService->getPagination($builder, $page, $limit);
            $data['entries'] = (new ArrayCollection($data['entries']))->map(function ($item) {
                if ($item) {
                    return $item;
                }

                return [
                    'id' => 'null',
                    'displayName' => 'Значение отсутствует',
                ];
            })->toArray();

            return [
                'context' => [
                    RelationNormalizer::RELATION_NORMALIZER => [
                        $metadata->getAssociationMapping($columnName)['targetEntity'] => true,
                    ],
                ],
                'data' => $data,
            ];
        } else {
            throw new NotFoundHttpException('No such field');
        }
    }

    /**
     * @param string $sortColumn
     * @param string $destination
     *
     * @return mixed
     */
    public function getGroup(
        string $className,
        string $columnName,
        string $value,
        int $page,
        int $limit,
        ?string $sortColumn = null,
        ?string $destination = null,
        QueryBuilder $builder = null
    ) {
        $metadata = $this->em->getClassMetadata($className);

        if (!$builder) {
            $builder = $this->em->getRepository($className)->createQueryBuilder('a');
        }

        if (in_array($columnName, $metadata->getFieldNames(), true)) {
            $fieldMetadata = $metadata->getFieldMapping($columnName);
            $fieldType = $fieldMetadata['type'];

            $expr = $builder->expr();
            $condField = "a.$columnName";

            if ('json' === $fieldType) {
                $condField = DoctrineJsonFormatHelper::getGroupField($fieldMetadata);
            }

            $builder->andWhere($expr->eq($condField, ':fieldValue'))
                ->setParameter('fieldValue', $value);
        } elseif ($metadata->hasAssociation($columnName)) {
            if ('null' === $value) {
                $builder->andWhere($builder->expr()->isNull('a.'.$columnName));
            } else {
                $expr = $builder->expr();
                $builder->leftJoin('a.'.$columnName, 'association')
                    ->andWhere($expr->eq('association.id', ':fieldValue'))
                    ->setParameter('fieldValue', $value);
            }
        } else {
            throw new NotFoundHttpException('No such field');
        }

        if ($destination && $sortColumn) {
            $this->sortingService->sort($className, $sortColumn, $destination, $builder);
        }

        $builder->setFirstResult(($page * $limit) - $limit)
            ->setMaxResults($limit);

        return $this->paginationService->getPagination($builder, $page, $limit);
    }
}
