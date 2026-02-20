<?php

namespace App\Security;

use App\Entity\User;
use Symfony\Component\Security\Core\Exception\BadCredentialsException;
use Symfony\Component\Security\Core\Exception\DisabledException;
use Symfony\Component\Security\Core\User\UserCheckerInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;

class UserChecker implements UserCheckerInterface
{
    public function checkPreAuth(UserInterface $user): void
    {
        if (!($user instanceof User)) {
            return;
        }

        if (!$user->isEnabled()) {
            throw new DisabledException('Пользователь заблокирован');
        }

        //В веб-интерфейс не могут зайти водители или контроллеры
        $roles = $user->getRoles();
        foreach ($roles as $role) {
            if (in_array($role, ["ROLE_MOBILE_DRIVER", "ROLE_MOBILE_INSPECTOR"])) {
                throw new BadCredentialsException("Неверный логин или пароль");
            }
        }

    }

    public function checkPostAuth(UserInterface $user, ?TokenInterface $token = null): void
    {
    }
}
