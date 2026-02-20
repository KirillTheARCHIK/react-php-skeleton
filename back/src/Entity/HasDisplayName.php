<?php

namespace App\Entity;

use Symfony\Component\Serializer\Attribute\Groups;

trait HasDisplayName
{
    abstract public function __toString(): string;

    /** Вариант представления в строчном виде */
    #[Groups(["View", "List", "Mobile"])]
    public function getDisplayName(): string
    {
        $name = strval($this);

        if(method_exists($this, 'getDeletedAt')) {
            $name .= $this->getDeletedAt() !== null ? " (Удалено)" : "";
        }

        return $name;
    }
}
