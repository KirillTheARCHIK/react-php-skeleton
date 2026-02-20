<?php

namespace App\Entity\Builder;

interface PositionableEntity
{
    public const POSITION_FIELD = 'positionNumber';

    public function getPositionNumber(): ?int;

    public function setPositionNumber(?int $positionNumber): void;
}
