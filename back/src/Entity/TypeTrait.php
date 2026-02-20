<?php

namespace App\Entity;

use Doctrine\DBAL\Types\Types;
use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

trait TypeTrait
{
    use PositionNumberTrait;

    /** Значение константы для взаимодействия в бизнес-логике */
    #[ORM\Column(type: Types::STRING, nullable: true, options: [
        "comment" => "Значение константы",
        ])]
    #[Groups(["Create", "Edit", "View"])]
    #[Assert\Type('string', groups: ['Edit', 'Create'])]
    #[Assert\NotBlank(groups: ['Edit', 'Create'])]
    protected ?string $slug;

    public function getSlug(): ?string
    {
        return $this->slug;
    }

    public function setSlug(?string $slug): static
    {
        $this->slug = $slug;
        return $this;
    }
}
