<?php

namespace App\Security;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Exception\AuthenticationException;

class SecurityService
{
    public function __construct(
        protected EntityManagerInterface $entityManager,
    ) {
    }

    /**
     * @param User|null $user
     * @return array
     */
    public function login(?User $user): array
    {

        if (!$user instanceof User) {
            throw new AuthenticationException('Invalid Credentials');
        }
        $token = hash('md5', microtime() . rand(10000, 100000));
        $user
            ->setToken($token);
        $this->entityManager->flush();
        return [
            'user' => $user->getUserIdentifier(),
            'token' => $token,
        ];
    }
}
