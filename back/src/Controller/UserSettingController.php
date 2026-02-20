<?php

namespace App\Controller;

use App\Controller\Builder\AbstractCatalogController;
use App\Entity\User;
use App\Entity\UserSetting;
use App\Serializer\RelationNormalizer;
use App\Service\Doctrine\DoctrineDeleteInterface;
use App\Service\Doctrine\DoctrineMasterEntityService;
use App\Service\UserSettingService;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\User\InMemoryUser;

#[Route('/api/v1/catalogs/user_settings')]
class UserSettingController extends AbstractCatalogController
{
    public static function getEntityName(): string
    {
        return UserSetting::class;
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
        $user = $this->getUser();
        if ($user instanceof InMemoryUser) {
            return $this->json(['total' => 0, 'entries' => []], Response::HTTP_OK);
        }
        $builder = $this->getQueryBuilder(UserSetting::class)
            ->andWhere('a.user = :user')
            ->setParameter('user', $this->getUser());

        return $this->list($request, $entityService, $builder, UserSetting::class);
    }

    #[Route('/{id}', methods: 'GET')]
    public function showAction(UserSetting $entity): Response
    {
        return $entity->getUser() === $this->getUser()
            ? $this->returnEntity($entity)
            : $this->json([Response::$statusTexts[Response::HTTP_FORBIDDEN]], Response::HTTP_FORBIDDEN);
    }

    #[Route('', methods: 'DELETE')]
    public function deleteAction(Request $request, DoctrineDeleteInterface $deleteService): Response
    {
        return $this->delete($request, $deleteService);
    }

    #[Route('', methods: 'POST')]
    public function createAction(Request $request): Response
    {
        return $this->create($request);
    }

    #[Route('/{id}', methods: 'PUT')]
    public function editAction(UserSetting $entity, Request $request): Response
    {
        return $entity->getUser() === $this->getUser()
            ? $this->edit($entity, $request)
            : $this->json([Response::$statusTexts[Response::HTTP_FORBIDDEN]], Response::HTTP_FORBIDDEN);
    }

    #[Route('/', methods: 'PUT')]
    public function createActionAllSettings(Request $request, UserSettingService $settingService): Response
    {
        try {
            $configs = json_decode($request->getContent(), true);
            $settings = $settingService->setAllSettings($configs);

            return $this->json($settings);
        } catch (\Exception $exception) {
            return $this->json(['error' => $exception->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
}
