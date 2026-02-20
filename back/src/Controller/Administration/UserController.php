<?php

namespace App\Controller\Administration;

use App\Controller\Builder\AbstractCatalogController;
use App\Entity\User;
use App\Serializer\RelationNormalizer;
use App\Service\Doctrine\DoctrineDeleteInterface;
use App\Service\Doctrine\DoctrineGroupingService;
use App\Service\Doctrine\DoctrineMasterEntityService;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;

#[Route('/api/v1/administration/users'), IsGranted('ROLE_ADMIN')]
class UserController extends AbstractCatalogController
{
    public static function getEntityName(): string
    {
        return User::class;
    }

    public function getDefaultNormalizerContext(): array
    {
        return [
            AbstractNormalizer::GROUPS => ['View'],
            RelationNormalizer::RELATION_NORMALIZER => [],
        ];
    }

    protected function getDefaultCreateContext(): array
    {
        return [];
    }

    #[Route('', methods: 'GET')]
    public function listAction(Request $request, DoctrineMasterEntityService $entityService): Response
    {
        return $this->list($request, $entityService);
    }

    #[Route('/{id}', methods: 'GET')]
    public function showAction(User $entity): Response
    {
        return $this->returnEntity($entity);
    }

    #[Route('/groups/{field}', methods: 'GET')]
    public function groupsAction(string $field, Request $request, DoctrineGroupingService $groupingService): Response
    {
        return $this->getGroups($field, $request, $groupingService);
    }

    #[Route('/groups/{field}/{value}', methods: 'GET')]
    public function getGroupByValueAction(
        string $field,
        string $value,
        Request $request,
        DoctrineGroupingService $groupingService
    ): Response {
        return $this->getGroupByValue($field, $value, $request, $groupingService);
    }

    #[Route('', methods: 'POST')]
    public function createAction(Request $request): Response
    {
        return $this->create($request);
    }

    #[Route('/{id}', methods: 'PUT')]
    public function editAction(User $entity, Request $request): Response
    {
        return $this->edit($entity, $request);
    }

    #[Route('', methods: 'DELETE')]
    public function deleteAction(Request $request, DoctrineDeleteInterface $deleteService): Response
    {
        return $this->delete($request, $deleteService);
    }
}
