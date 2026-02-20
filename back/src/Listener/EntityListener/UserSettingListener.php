<?php

namespace App\Listener\EntityListener;

use App\Entity\User;
use App\Entity\UserSetting;
use App\Service\UserSettingService;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\Events;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

#[
    AsEntityListener(event: Events::prePersist, entity: UserSetting::class),
    AsEntityListener(event: Events::preUpdate, entity: UserSetting::class),
    AsEntityListener(event: Events::preRemove, entity: UserSetting::class)
]


readonly class UserSettingListener
{
    public function __construct(
        private UserSettingService $settingService,
    ) {
    }

    public function prePersist(UserSetting $userSetting): void
    {
        $this->setUser($userSetting);
    }

    public function preUpdate(UserSetting $userSetting): void
    {
        $this->setUser($userSetting);
    }

    public function preRemove(UserSetting $userSetting): void
    {
        if ($this->settingService->getUser() !== $userSetting->getUser()) {
            throw new NotFoundHttpException('Not found required user setting in database!');
        }
    }

    private function setUser(UserSetting $userSetting): void
    {
        $user = $this->settingService->getUser();
        if ($user instanceof User) {
            $userSetting->setUser($user);
        }
    }
}
