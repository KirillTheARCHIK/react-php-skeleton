<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;

trait HasEditor
{
    /** Пользователь, обновивший запись */
    #[ORM\ManyToOne(User::class)]
    #[ORM\JoinColumn(onDelete: "SET NULL", options: ["comment" => "Пользователь, обновивший запись"])]
    #[Gedmo\Blameable()]
    protected ?User $editor;

    public function getEditor(): ?User
    {
        return $this->editor;
    }

    public function setEditor(?User $editor): self
    {
        $this->editor = $editor;
        return $this;
    }
}
