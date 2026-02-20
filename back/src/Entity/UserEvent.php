<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\InMemoryUser;
use Symfony\Component\Serializer\Attribute\Groups;
use Doctrine\DBAL\Types\Types;
use Gedmo\Mapping\Annotation as Gedmo;
use Symfony\Component\Security\Core\User\UserInterface;
use App\Attribute\ExportEntity;

#[ExportEntity("Действия пользователей")]
#[ORM\Table("user_events")]
#[ORM\Entity(readOnly: true)]
class UserEvent
{
    use HasDisplayName;
    use HasCreatedAt;

    #[ORM\Id]
    #[ORM\GeneratedValue("IDENTITY")]
    #[ORM\Column(type: Types::INTEGER, options: ["comment" => "Идентификатор"])]
    #[Groups(["View", "External"])]
    protected ?int $id;

    /** Описание */
    #[ORM\Column(type: Types::STRING, nullable: true, options: ["comment" => "Описание"])]
    #[Groups(["View"])]
    protected ?string $description;

    /** Объект */
    #[ORM\Column(type: Types::JSONB, options: [
        "comment" => "Объект",
        "jsonFormat" => "keyValue",
        "filterBy" => "value",
    ])]
    #[Groups(["View"])]
    protected array $entityName;

    /** Тип события */
    #[ORM\Column(type: Types::JSONB, options: [
        "comment" => "Тип события",
        "jsonFormat" => "keyValue",
    ])]
    #[Groups(["View"])]
    protected array $type;

    /** Пользователь */
    #[ORM\ManyToOne(User::class)]
    #[ORM\JoinColumn(onDelete: "SET NULL", options: ["comment" => "Пользователь"])]
    #[Gedmo\Blameable(on: 'create')]
    protected ?User $user = null;

    /** Имя пользователя */
    #[ORM\Column(type: Types::STRING, nullable: true, options: ["comment" => "Имя пользователя"])]
    #[Groups(["View"])]
    #[Gedmo\Blameable(on: 'create')]
    protected ?string $username;

    /**
     * @return ?int
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;
        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    /**
     * @param int|float|string $key
     * @param string           $value
     *
     * @return UserEvent
     */
    public function setEntityName($key, $value)
    {
        $this->entityName = [
            'key' => $key,
            'value' => $value,
        ];

        return $this;
    }

    /**
     * @return array
     */
    public function getEntityName()
    {
        return $this->entityName;
    }

    /**
     * @return array
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * @param int|float|string $key
     * @param string           $value
     *
     * @return UserEvent
     */
    public function setType($key, $value)
    {
        $this->type = [
            'key' => $key,
            'value' => $value,
        ];

        return $this;
    }

    public function setUser(?UserInterface $user): self
    {
        if ($user) {
            if ($user instanceof InMemoryUser) {
                $this->username = $user->getUserIdentifier();
                return $this;
            } elseif ($user instanceof User) {
                $this->username = $user->getUsername();
                $this->user = $user;
            }
        } else {
            $this->user = $user;
        }
        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    #[Groups(["View"])]
    public function getUserString(): ?string
    {
        return null !== $this->user ? $this->user->getFirstName() : $this->username;
    }

    /**
     * @return string|null
     */
    public function getUsername()
    {
        if (!$this->username) {
            if (null !== $this->user) {
                return $this->user->getUsername();
            } else {
                return null;
            }
        }

        return $this->username;
    }

    /**
     * @param string $username
     *
     * @return UserEvent
     */
    public function setUsername($username)
    {
        $this->username = $username;

        return $this;
    }

    /**
     * Return event description.
     *
     * @return string
     */
    public function __toString()
    {
        return sprintf('%s %s', $this->username, $this->description);
    }
}
