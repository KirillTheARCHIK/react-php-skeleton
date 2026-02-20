<?php

namespace App\Entity\Integration;

use App\Entity\HasDisplayName;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Table(name="integration_information_systems")
 *
 * @ORM\Entity()
 */
class InformationSystem
{
    use HasDisplayName;
    /**
     * @var int
     *
     * @ORM\Column(type="integer")
     *
     * @ORM\Id
     *
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    protected $id;

    /**
     * @var string
     *
     * @ORM\Column(type="string", unique=true)
     */
    protected $title;

    /**
     * @var string
     *
     * @ORM\Column(type="string")
     */
    protected $description;

    /**
     * @var string
     *
     * @ORM\Column(type="string")
     */
    protected $host;

    /**
     * @var array
     *
     * @ORM\Column(type="json", nullable=true)
     */
    protected $arguments;

    public function getTitle(): string
    {
        return $this->title;
    }

    public function setTitle(string $title): void
    {
        $this->title = $title;
    }

    public function getDescription(): string
    {
        return $this->description;
    }

    public function setDescription(string $description): void
    {
        $this->description = $description;
    }

    public function getHost(): string
    {
        return $this->host;
    }

    public function setHost(string $host): void
    {
        $this->host = $host;
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getArguments(): array
    {
        return $this->arguments;
    }

    public function setArguments(array $arguments): void
    {
        $this->arguments = $arguments;
    }

    public function __toString()
    {
        return $this->description;
    }
}
