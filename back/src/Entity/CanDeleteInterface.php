<?php

namespace App\Entity;

interface CanDeleteInterface
{
    public function getCanDelete(): bool;
}
