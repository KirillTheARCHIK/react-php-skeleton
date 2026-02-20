<?php

namespace App\Service;

use Symfony\Component\Validator\Context\ExecutionContextInterface;

class ValidatorService
{
    public static function validateDate($object, ExecutionContextInterface $context): void
    {
        try {
            new \DateTime($object);
        } catch (\Exception) {
            $context->buildViolation('Неверный формат даты')->addViolation();
        }
    }
}
