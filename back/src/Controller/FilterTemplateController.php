<?php

namespace App\Controller;

use App\Controller\Builder\AbstractCatalogController;
use App\Entity\FilterTemplate;
use App\Entity\User;
use App\Repository\FilterTemplateRepository;
use App\Security\Voters\FilterTemplateVoter;
use App\Serializer\RelationNormalizer;
use App\Serializer\UserNormalizer;
use App\Service\CatalogService;
use App\Service\Doctrine\DoctrineDeleteInterface;
use App\Service\Doctrine\DoctrineMasterEntityService;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;

#[Route('/api/v1/catalogs/filter_templates')]
class FilterTemplateController extends AbstractCatalogController
{
    public static function getEntityName(): string
    {
        return FilterTemplate::class;
    }

    public function getDefaultNormalizerContext(): array
    {
        return [
            AbstractNormalizer::GROUPS => ['View'],
            UserNormalizer::COLLAPSE => true,
            RelationNormalizer::RELATION_NORMALIZER => [
                User::class => true
            ]
        ];
    }

    #[Route('/catalog/{catalogSlug}', methods: 'GET')]
    public function catalogListAction(
        string                      $catalogSlug,
        CatalogService              $catalogService,
        Request                     $request,
        DoctrineMasterEntityService $entityService
    ): Response {
        if (!$catalogService->findCatalogInfo($catalogSlug)) {
            throw $this->createNotFoundException();
        }

        /** @var FilterTemplateRepository $repo */
        $repo = $this->managerRegistry->getRepository(self::getEntityName());

        $user = $this->getUser();
        $builder = $repo->getAccessibleFiltersQueryBuilder($user, $catalogSlug);
        return $this->list($request, $entityService, $builder);
    }

    #[Route('/{id}', methods: 'GET'), IsGranted(FilterTemplateVoter::SHOW, 'entity')]
    public function showAction(FilterTemplate $entity): Response
    {
        return $this->returnEntity($entity);
    }

    #[Route('', methods: 'POST')]
    public function createAction(Request $request): Response
    {
        return $this->create($request);
    }

    #[Route('/{id}', methods: 'PUT'), IsGranted(FilterTemplateVoter::EDIT, 'entity')]
    public function editAction(FilterTemplate $entity, Request $request): Response
    {
        return $this->edit($entity, $request);
    }

    #[Route('', methods: 'DELETE')]
    public function deleteAction(Request $request, DoctrineDeleteInterface $deleteService): Response
    {
        $ids = $request->get('ids', []);
        foreach ($ids as $id) {
            $entity = $this->managerRegistry->getRepository(self::getEntityName())->find($id);
            if (!$entity) {
                continue;
            }

            if (!$this->isGranted(FilterTemplateVoter::DELETE, $entity)) {
                throw $this->createAccessDeniedException();
            }
        }

        return $this->delete($request, $deleteService);
    }
}
