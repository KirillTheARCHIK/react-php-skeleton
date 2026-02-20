<?php

namespace App\Entity;

use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

trait HasCreatedAt
{
    /**
     * Дата создания записи
     */
    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true, options: [
        "comment" => "Дата создания",
    ])]
    #[Groups(["View", "External"])]
    protected \DateTime $createdAt;

    public function getCreatedAt(): ?\DateTime
    {
        return $this->createdAt;
    }

    public function setCreatedAt(?\DateTime $createdAt): self
    {
        $this->createdAt = $createdAt;
        return $this;
    }

    #[ORM\PrePersist]
    public function setCreatedAtPrePersist()
    {
        $this->createdAt = new \DateTime();
    }
}
