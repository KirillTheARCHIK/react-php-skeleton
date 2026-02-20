<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;

trait HasAuthor
{
    /** Пользователь, создавший запись */
    #[ORM\ManyToOne(User::class)]
    #[ORM\JoinColumn(onDelete: "SET NULL", options: ["comment" => "Пользователь, создавший запись"])]
    #[Gedmo\Blameable(on: 'create')]
    protected ?User $author = null;

    public function getAuthor(): ?User
    {
        return $this->author;
    }

    public function setAuthor(?User $author): self
    {
        $this->author = $author;
        return $this;
    }
}
