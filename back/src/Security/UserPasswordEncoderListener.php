<?php

namespace App\Security;

use App\Entity\User;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasher;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserPasswordEncoderListener
{
    public function __construct(private UserPasswordHasherInterface $passwordHasher)
    {
    }

    public function prePersist(User $user)
    {
        $this->encodePassword($user);
    }

    public function preUpdate(User $user)
    {
        $this->encodePassword($user);
    }

    public function encodePassword(User $user)
    {
        if (null !== $user->getPlainPassword()) {
            $userPainPassword = $user->getPlainPassword();
            $encodedPassword = $this->passwordHasher->hashPassword($user, $userPainPassword);
            $user->setPassword($encodedPassword);
        }
    }
}
