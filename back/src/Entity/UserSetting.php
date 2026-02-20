<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Attribute\Groups;
use Doctrine\DBAL\Types\Types;

/** Пользовательская настройка */
#[ORM\Entity()]
#[ORM\Table("user_settings")]
#[UniqueEntity(["name", "user"])]
class UserSetting
{
    /** Идентификатор */
    #[ORM\Id]
    #[ORM\GeneratedValue("IDENTITY")]
    #[ORM\Column(type: Types::INTEGER, options: ["comment" => "Идентификатор"])]
    #[Groups(["View"])]
    private ?int $id = null;

    /** Наименование */
    #[ORM\Column(type: Types::STRING, options: ["comment" => "Наименование"])]
    #[Groups(["View", "CreateOrEdit"])]
    private string $name;

    /** Значение */
    #[ORM\Column(type: Types::STRING, nullable: true, options: ["comment" => "Значение"])]
    #[Groups(["View", "CreateOrEdit"])]
    private ?string $value = null;

    /** Описание */
    #[ORM\Column(type: Types::STRING, nullable: true, options: ["comment" => "Описание"])]
    #[Groups(["View", "CreateOrEdit"])]
    private ?string $description = null;

    /** Пользователь */
    #[ORM\ManyToOne(User::class)]
    #[ORM\JoinColumn(onDelete: "CASCADE", options: ["comment" => "Пользователь"])]
    #[Groups(["View", "CreateOrEdit"])]
    private ?User $user = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): self
    {
        $this->id = $id;
        return $this;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;
        return $this;
    }

    public function getValue(): ?string
    {
        return $this->value;
    }

    public function setValue(?string $value): self
    {
        $this->value = $value;
        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;
        return $this;
    }

    public function getUser(): User
    {
        return $this->user;
    }

    public function setUser(User $user): self
    {
        $this->user = $user;
        return $this;
    }
}
