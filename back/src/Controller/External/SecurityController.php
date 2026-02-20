<?php

namespace App\Controller\External;

use App\Entity\User;
use App\Security\SecurityService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route(path: '/api/v1/external/security')]
class SecurityController extends AbstractController
{
    public function __construct(
        protected EntityManagerInterface $entityManager,
    ) {
    }

    #[Route(path: '', name: 'external_login', methods: ['POST'])]
    public function login(SecurityService $securityService, #[CurrentUser] ?User $user = null): Response
    {
        return $this->json($securityService->login($user));
    }
}
