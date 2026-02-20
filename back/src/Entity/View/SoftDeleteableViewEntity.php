<?php

namespace App\Entity\View;

use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

trait SoftDeleteableViewEntity
{
    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    protected \DateTime $deletedAt;

    public function getDeletedAt(): \DateTime
    {
        return $this->deletedAt;
    }

    public function isDeleted(): bool
    {
        return null !== $this->deletedAt;
    }
}
