<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Gedmo\SoftDeleteable\Traits\SoftDeleteableEntity;
use Doctrine\DBAL\Types\Types;

/** Задачи */
#[ORM\Table("user_tasks")]
#[ORM\Entity()]
#[Gedmo\SoftDeleteable()]
class UserTask
{
    use SoftDeleteableEntity;
    public const IN_PROGRESS = 'in_progress';
    public const FINISHED = 'finished';
    public const ERROR = 'error';
    public const DISTRIBUTE = 'distribute';

    #[ORM\Id]
    #[ORM\GeneratedValue("IDENTITY")]
    #[ORM\Column(type: Types::INTEGER, options: ["comment" => "Идентификатор"])]
    private ?int $id = null;

    /** Наименование */
    #[ORM\Column(type: Types::STRING, options: ["comment" => "Наименование"])]
    private string $name;

    /** Тип */
    #[ORM\Column(type: Types::STRING, options: ["comment" => "Тип"])]
    private string $type;

    /** ДатаВремя начала */
    #[ORM\Column(type: Types::DATETIME_MUTABLE, options: ["comment" => "ДатаВремя начала"])]
    private \DateTime $startedAt;

    /** ДатаВремя окончания */
    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true, options: ["comment" => "ДатаВремя окончания"])]
    private ?\DateTime $finishedAt = null;

    /** Наименование файла */
    #[ORM\Column(type: Types::STRING, nullable: true, options: ["comment" => "Наименование файла"])]
    private ?string $filename = null;

    /** Пользователь */
    #[ORM\ManyToOne(User::class)]
    #[ORM\JoinColumn(onDelete: "CASCADE", options: ["comment" => "Пользователь"])]
    private User $user;

    /** Статус */
    #[ORM\Column(type: Types::STRING, options: ["comment" => "Статус"])]
    private $status = self::IN_PROGRESS;

    /**
     * @return ?int
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): self
    {
        $this->id = $id;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param mixed $name
     */
    public function setName($name): self
    {
        $this->name = $name;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * @param mixed $type
     */
    public function setType($type): self
    {
        $this->type = $type;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getStartedAt()
    {
        return $this->startedAt;
    }

    /**
     * @param mixed $startedAt
     */
    public function setStartedAt($startedAt): self
    {
        $this->startedAt = $startedAt;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getFinishedAt()
    {
        return $this->finishedAt;
    }

    /**
     * @param mixed $finishedAt
     */
    public function setFinishedAt($finishedAt): self
    {
        $this->finishedAt = $finishedAt;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getFilename()
    {
        return $this->filename;
    }

    /**
     * @param mixed $filename
     */
    public function setFilename($filename): self
    {
        $this->filename = $filename;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * @param mixed $user
     */
    public function setUser($user): self
    {
        $this->user = $user;
        return $this;
    }

    public function getStatus(): string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;
        return $this;
    }
}
