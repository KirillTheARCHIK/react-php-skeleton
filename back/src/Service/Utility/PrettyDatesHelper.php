<?php

namespace App\Service\Utility;

class PrettyDatesHelper
{
    public static function getPrettyYears(int $years): string
    {
        if ($years % 100 >= 11 && $years % 100 <= 19) {
            $years .= ' лет';
        } elseif (1 === $years % 10) {
            $years .= ' год';
        } elseif ($years % 10 >= 2 && $years % 10 <= 4) {
            $years .= ' года';
        } else {
            $years .= ' лет';
        }

        return $years;
    }

    public static function getPrettyMonths(int $months): string
    {
        if ($months % 100 >= 11 && $months % 100 <= 19) {
            $months .= ' месяцев';
        } elseif (1 === $months % 10) {
            $months .= ' месяц';
        } elseif ($months % 10 >= 2 && $months % 10 <= 4) {
            $months .= ' месяца';
        } else {
            $months .= ' месяцев';
        }

        return $months;
    }
}
