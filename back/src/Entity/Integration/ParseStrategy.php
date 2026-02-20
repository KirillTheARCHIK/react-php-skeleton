<?php

namespace App\Entity\Integration;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity()
 *
 * @ORM\Table(name="integration_parse_strategies")
 */
class ParseStrategy
{
    /**
     * @ORM\Column(type="integer")
     *
     * @ORM\Id()
     *
     * @ORM\GeneratedValue(strategy="IDENTITY")
     *
     * @Groups({"View"})
     */
    protected ?int $id;

    /**
     * @ORM\Column(type="string")
     *
     * @Groups({"View"})
     */
    protected ?string $key;

    /**
     * @ORM\Column(type="string")
     *
     * @Groups({"View"})
     */
    protected ?string $name;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getKey(): ?string
    {
        return $this->key;
    }

    public function setKey(?string $key): void
    {
        $this->key = $key;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): void
    {
        $this->name = $name;
    }
}
