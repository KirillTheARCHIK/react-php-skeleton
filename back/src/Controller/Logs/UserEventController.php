<?php

namespace App\Controller\Logs;

use App\Controller\Builder\AbstractCatalogController;
use App\Entity\User;
use App\Entity\UserEvent;
use App\Serializer\RelationNormalizer;
use App\Service\Doctrine\DoctrineGroupingService;
use App\Service\Doctrine\DoctrineMasterEntityService;
use App\Service\Export\ExportManager;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/v1/logs/userevents'), IsGranted('ROLE_ADMIN')]
class UserEventController extends AbstractCatalogController
{
    public static function getEntityName(): string
    {
        return UserEvent::class;
    }

    public function getDefaultNormalizerContext(): array
    {
        return [
            RelationNormalizer::RELATION_NORMALIZER => [
                User::class => true,
            ],
        ];
    }

    #[Route('', methods: 'GET')]
    public function listAction(Request $request, DoctrineMasterEntityService $entityService): Response
    {
        return $this->list($request, $entityService);
    }

    #[Route('/{id}', methods: 'GET')]
    public function showAction(UserEvent $entity): Response
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

    #[Route('/export', methods: 'POST')]
    public function exportAction(Request $request, ExportManager $exportManager): Response
    {
        return $this->export($request, $exportManager);
    }
}
