<?php

namespace App\Controller;

use App\Entity\User;
use App\Serializer\RelationNormalizer;
use App\Service\Security\RoleManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\User\InMemoryUser;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\SerializerInterface;

class SecurityController extends AbstractController
{
    #[Route('/api/v1/login', name: 'app_login', methods: ['GET', 'POST'])]
    public function login(
        AuthenticationUtils $authenticationUtils,
        SerializerInterface $serializer,
        Security $security,
    ): Response {
        // get the login error if there is one
        $error = $authenticationUtils->getLastAuthenticationError();
        $user = $this->getUser();
        if (is_object($user)) {
            if ($user instanceof InMemoryUser) {
                $user = self::convertUser($user);
            }

            // //Impersonate
            // $token = $security->getToken();
            // if ($token instanceof SwitchUserToken) {
            //     $user->setInImpersonate(true);
            //     $user->setCanImpersonate(false);
            // } else {
            //     $user->setCanImpersonate($security->isGranted("ROLE_IMPERSONATE"));
            // }



            $data = $serializer->serialize($user, 'json', [
                AbstractNormalizer::GROUPS => ['View', 'Profile'],
                RelationNormalizer::RELATION_NORMALIZER => [],
            ]);
        } else {
            return new JsonResponse([], 401);
        }

        return new Response($data, $error ? 401 : 200, [
            'Content-Type' => 'application/json',
        ]);
    }

    public static function convertUser(InMemoryUser $inMemoryUser): User
    {
        $user = new User();
        $user->setLogin($inMemoryUser->getUserIdentifier());
        $user->setFirstName($inMemoryUser->getUserIdentifier());
        $user->setRoles($inMemoryUser->getRoles());

        return $user;
    }

    #[Route('/api/v1/roles', methods: 'GET')]
    public function getRoles(RoleManager $roleManager): Response
    {
        $roleMap = $roleManager->getAvailableRolesByCurrentUser();
        return $this->json($roleMap);
    }

    #[Route('/api/v1/logout', name: 'app_logout', methods: 'GET')]
    public function logout(): Response
    {
        return $this->json(null);
    }
}
