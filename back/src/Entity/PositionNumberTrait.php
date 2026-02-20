<?php

namespace App\Entity;

use Doctrine\DBAL\Types\Types;
use Gedmo\Mapping\Annotation as Gedmo;
use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

trait PositionNumberTrait
{
    /** Порядковый номер строки для отображения в комбобоксе */
    #[ORM\Column(type: Types::INTEGER, nullable: true, options: [
        "comment" => "Порядковый номер строки для отображения в комбобоксе",
    ])]
    #[Groups(["Create", "Move", "View"])]
    #[Gedmo\SortablePosition]
    #[Assert\Type('integer', groups: ['Edit', 'Create'])]
    #[Assert\NotBlank(groups: ['Edit', 'Create'])]
    protected ?int $positionNumber = null;

    public function getPositionNumber(): ?int
    {
        return $this->positionNumber;
    }

    public function setPositionNumber(?int $positionNumber): self
    {
        $this->positionNumber = $positionNumber;
        return $this;
    }

    // public function getName(): ?string
    // {
    //     return $this->name;
    // }

    // public function setName(?string $name): self
    // {
    //     $this->name = $name;
    //     return $this;
    // }
}
