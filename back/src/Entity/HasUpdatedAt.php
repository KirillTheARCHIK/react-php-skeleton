<?php

namespace App\Entity;

use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

trait HasUpdatedAt
{
    /** Дата обновления записи */
    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true, options: [
        "comment" => "Дата обновления",
    ])]
    #[Groups(["View", "External"])]
    protected \DateTime $updatedAt;

    /**
     * @return \DateTime
     */
    public function getUpdatedAt()
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(\DateTime $updatedAt): void
    {
        $this->updatedAt = $updatedAt;
    }

    #[ORM\PrePersist]
    public function setUpdatedAtPrePersist()
    {
        $this->updatedAt = new \DateTime();
    }

    #[ORM\PreUpdate]
    public function setUpdatedAtOnUpdate()
    {
        $this->updatedAt = new \DateTime();
    }
}
