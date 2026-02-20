<?php

namespace App\Service;

use App\Entity\User;
use App\Entity\UserSetting;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\User\InMemoryUser;
use Symfony\Component\Security\Core\User\UserInterface;

class UserSettingService
{
    public const LIMIT = 'limit';

    public function __construct(
        protected EntityManagerInterface $em,
        protected TokenStorageInterface $tokenStorage
    ) {
    }

    public function setValue(string $name, ?string $value = null, ?string $description = null, ?User $user = null): void
    {
        if ($this->getUser() instanceof InMemoryUser) {
            return;
        }

        if (!$user instanceof User) {
            $user = $this->getUser();
        }
        $setting = $this->em->getRepository(UserSetting::class)->findOneBy(['name' => $name, 'user' => $user]);

        if (!$setting instanceof UserSetting) {
            $setting = (new UserSetting())
                ->setName($name);
        }
        $setting
            ->setValue($value)
            ->setDescription($description ?? $setting->getDescription())
            ->setUser($user ?? $setting->getUser());
        $this->em->persist($setting);
        $this->em->flush();
    }

    public function getValue(string $name, ?string $defaultValue = null): ?string
    {
        if ($this->getUser() instanceof InMemoryUser) {
            return $defaultValue;
        }

        $setting = $this->em->getRepository(UserSetting::class)->findOneBy(['name' => $name, 'user' => $this->getUser()]);
        if (!$setting instanceof UserSetting) {
            return $defaultValue;
        }

        return $setting->getValue();
    }

    public function getAllSettings(): ?array
    {
        return $this->em->getRepository(UserSetting::class)->findBy(['user' => $this->getUser()]);
    }

    public function setAllSettings(array $settings): ?array
    {
        foreach ($settings as $name => $value) {
            $this->setValue($name, $value);
        }

        return $this->getAllSettings();
    }

    public function getUser(): ?UserInterface
    {
        $token = $this->tokenStorage->getToken();
        return $token?->getUser();
    }
}
