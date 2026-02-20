<?php

namespace App\Controller\Builder;

use App\Entity\Builder\PositionableEntity;
use App\Entity\CanDeleteInterface;
use App\Serializer\UserNormalizer;
use App\Service\Doctrine\DoctrineDeleteInterface;
use App\Service\Doctrine\DoctrineGroupingService;
use App\Service\Doctrine\DoctrineMasterEntityService;
use App\Service\Doctrine\DoctrinePaginationService;
use App\Service\Doctrine\DoctrineSortingService;
use App\Service\Doctrine\EntityFilters\EntityFilterInterface;
use App\Service\Doctrine\EntityFilters\EntitySortInterface;
use App\Service\DtoService;
use App\Service\Export\ExportManager;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping\MappingException;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintViolation;
use Symfony\Component\Validator\Validator\ValidatorInterface;

abstract class AbstractCatalogController extends AbstractController
{
    public function __construct(
        protected ManagerRegistry       $managerRegistry,
        protected SerializerInterface   $serializer,
        protected ValidatorInterface    $validator,
        protected DenormalizerInterface $denormalizer,
        protected DtoService $dtoService,
    ) {
    }

    abstract public static function getEntityName(): string;

    public static function getEntityViewName(): string
    {
        return static::getEntityName();
    }

    protected function getDefaultNormalizerContext(): array
    {
        return [
            AbstractNormalizer::GROUPS => ['View'],
            UserNormalizer::COLLAPSE => true,
        ];
    }

    protected function getDefaultCreateContext(): array
    {
        return [
            AbstractNormalizer::GROUPS => ['Create', 'CreateOrEdit'],
        ];
    }

    protected function getDefaultEditContext($entity): array
    {
        return [
            AbstractNormalizer::OBJECT_TO_POPULATE => $entity,
            AbstractNormalizer::GROUPS => ['Edit', 'CreateOrEdit'],
        ];
    }

    protected function returnEntity($entity, array $context = null): Response
    {
        return $this->json(
            $entity,
            Response::HTTP_OK,
            [],
            $context ?? $this->getDefaultNormalizerContext()
        );
    }

    protected function validateAndFlushEntity($entity, ?array $groups = null): Response
    {
        $errors = $this->validator->validate($entity, null, $groups);
        if ($errors->count() > 0) {
            $status = null;
            if ($errors->count() === 1 && ($groups = $errors[0]->getConstraint()?->groups)) {
                foreach ($groups as $group) {
                    if (Constraint::DEFAULT_GROUP !== $group) {
                        $status = strtolower($group);
                        break;
                    }
                }
            }
            return $this->json(
                $errors,
                Response::HTTP_BAD_REQUEST,
                [],
                $this->getDefaultNormalizerContext() + [
                    'status' => $status
                ]
            );
        }

        $em = $this->managerRegistry->getManager();
        $em->persist($entity);
        $em->flush();

        return $this->returnEntity($entity);
    }

    protected function getQueryBuilder(?string $className = null): QueryBuilder
    {
        $className ??= static::getEntityViewName();

        $em = $this->managerRegistry->getManager();
        $query = $em
            ->getRepository($className)
            ->createQueryBuilder('a');

        $meta = $em->getClassMetadata($className);
        if ($meta->hasField(PositionableEntity::POSITION_FIELD)) {
            $query
                ->orderBy('a.' . PositionableEntity::POSITION_FIELD, 'DESC');
        }

        return $query;
    }

    protected function list(
        Request                     $request,
        DoctrineMasterEntityService $entityService,
        QueryBuilder                $builder = null,
        string                      $entityName = null,
        array                       $context = null,
        EntityFilterInterface       $filter = null,
        EntitySortInterface $entitySort = null,
    ): Response {
        try {
            $rows = $entityService->getDataByRequestQueryString($entityName ?? static::getEntityViewName(), $request, $builder, $filter, $entitySort);

            return $this->json($rows, Response::HTTP_OK, [], $context ?? $this->getDefaultNormalizerContext());
        } catch (MappingException|\InvalidArgumentException $exception) {
            return new JsonResponse(['error' => $exception->getMessage()], JsonResponse::HTTP_BAD_REQUEST);
        } catch (\Exception $exception) {
            return new JsonResponse(['error' => $exception->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    protected function create(Request $request, $context = null): Response
    {
        try {
            $entity = $this->serializer->deserialize(
                $request->getContent(),
                static::getEntityName(),
                'json',
                $context ?? $this->getDefaultCreateContext(),
            );

            if (($check = $request->query->get('check')) !== null) {
                $errors = $this->validator->validate($entity, null, [ucfirst($check)]);
                if ($errors->count() > 0) {
                    return $this->json(
                        $errors,
                        Response::HTTP_BAD_REQUEST,
                        [],
                        $this->getDefaultNormalizerContext()
                    );
                }

                return new JsonResponse(null, JsonResponse::HTTP_NO_CONTENT);
            }

            return $this->validateAndFlushEntity($entity);
        } catch (\Exception $exception) {
            return $this->json(['error' => $exception->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }

    protected function edit($entity, Request $request, array $context = null): Response
    {
        try {
            $context ??= $this->getDefaultEditContext($entity);

            $entity = $this->serializer->deserialize(
                $request->getContent(),
                static::getEntityName(),
                'json',
                $context
            );

            return $this->validateAndFlushEntity($entity);
        } catch (\Exception $exception) {
            return $this->json(['error' => $exception->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }

    protected function delete(Request $request, DoctrineDeleteInterface $deleteService, string $entityName = null, QueryBuilder $builder = null): Response
    {
        $em = $this->managerRegistry->getManager();
        try {
            if ('true' === $request->query->get('all', 'false')) {
                $deleteService->deleteAll($entityName ?? static::getEntityName(), builder: $builder);

                return $this->json([], Response::HTTP_OK, [], $this->getDefaultNormalizerContext());
            } else {
                $ids = new ArrayCollection($request->get('ids'));

                $entities = $ids->map(function ($item) use ($em, $entityName) {
                    $entity = $em->find($entityName ?? static::getEntityName(), $item);
                    if (!$entity) {
                        throw $this->createNotFoundException();
                    }
                    if (method_exists($entity, 'getExternalId') && $entity->getExternalId()) {
                        throw new \Exception('Невозможно удалить интеграционную запись');
                    }
                    if ($entity instanceof CanDeleteInterface && !$entity->getCanDelete()) {
                        throw new \Exception('Невозможно удалить запись, т.к. она используется');
                    }
                    $em->remove($entity);

                    return $entity;
                })->toArray();
                $em->flush();

                return $this->json($entities, Response::HTTP_OK, [], $this->getDefaultNormalizerContext());
            }
        } catch (\Exception $exception) {
            return $this->json(['error' => $exception->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }

    protected function getGroups(
        string                  $field,
        Request                 $request,
        DoctrineGroupingService $groupingService,
        QueryBuilder            $builder = null,
        string                  $entityName = null,
    ): Response {
        $page = $request->get('page', DoctrinePaginationService::DEFAULT_PAGE);
        $limit = $request->get('limit', DoctrinePaginationService::DEFAULT_LIMIT);
        $sort = $request->get('sort', DoctrineSortingService::ASC_SORT);

        $result = $groupingService->getGroupsByField(
            $entityName ?? static::getEntityViewName(),
            $field,
            $page,
            $limit,
            $sort,
            $builder
        );

        return $this->json($result['data'], Response::HTTP_OK, [], $result['context']);
    }

    protected function getGroupByValue(
        string                  $field,
        string                  $value,
        Request                 $request,
        DoctrineGroupingService $groupingService,
        QueryBuilder            $builder = null,
        string                  $entityName = null,
        array                   $context = null,
    ): Response {
        $page = $request->get('page', DoctrinePaginationService::DEFAULT_PAGE);
        $limit = $request->get('limit', DoctrinePaginationService::DEFAULT_LIMIT);
        $sort = $request->get('sort', DoctrineSortingService::ASC_SORT);
        $column = $request->get('column', 'id');
        $result = $groupingService->getGroup(
            $entityName ?? static::getEntityViewName(),
            $field,
            $value,
            $page,
            $limit,
            $column,
            $sort,
            $builder
        );

        return $this->json($result, Response::HTTP_OK, [], $context ?? $this->getDefaultNormalizerContext());
    }

    protected function export(Request $request, ExportManager $exportManager): Response
    {
        try {
            return $this->json([
                'eventId' => $exportManager->export(static::getEntityViewName(), $request),
            ]);
        } catch (\Exception $exception) {
            return $this->json(['error' => $exception->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
}
