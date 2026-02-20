<?php

namespace App\Service\Utility;

use Symfony\Component\Validator\Constraints as Assert;

class ConstantEntityHelper
{
    public const K_01 = 'К_01';
    public const K_02 = 'К_02';
    public const K_03 = 'К_03';
    public const K_04 = 'К_04';
    public const K_05 = 'К_05';
    public const K_06 = 'К_06';
    public const K_07 = 'K_07';
    public const K_08 = 'K_08';
    public const K_09 = 'K_09';
    public const K_10 = 'K_10';
    public const K_11 = 'К_11';
    public const K_12 = 'К_12';
    public const K_13 = 'К_13';
    public const K_14 = 'К_14';
    public const K_15 = 'К_15';
    public const K_17 = 'К_17';
    public const K_20 = 'К_20';
    public const KUMN_KVTS = 'kumn_kvts';
    public const KONST_KVTS = 'konst_kvts';
    public const KP_KPVO = 'kp_kpvo';

    public static function getConstraint(string $slug)
    {
        $constraint = null;

        switch ($slug) {
            case self::K_01:
            case self::K_02:
            case self::K_03:
            case self::K_04:
            case self::KONST_KVTS:
                $constraint = [
                    new Assert\Collection([
                        'value' => [
                            new Assert\GreaterThanOrEqual(0),
                            new Assert\LessThanOrEqual(100),
                        ],
                    ]),
                ];
                break;
            case self::K_05:
                $constraint = [
                    new Assert\Collection([
                        'value' => [
                            new Assert\GreaterThanOrEqual(3),
                            new Assert\LessThanOrEqual(100),
                        ],
                    ]),
                ];
                break;
            case self::K_06:
                $constraint = [
                    new Assert\Collection([
                        'value' => [
                            new Assert\GreaterThanOrEqual(0),
                            new Assert\LessThanOrEqual(1),
                        ],
                    ]),
                ];
                break;
            case self::K_11:
            case self::K_12:
                $constraint = [
                    new Assert\Collection([
                        'value' => [
                            new Assert\GreaterThanOrEqual(-80),
                            new Assert\LessThanOrEqual(80),
                        ],
                    ]),
                ];
                break;
            case self::K_13:
            case self::K_14:
            case self::K_15:
                $constraint = [
                    new Assert\Collection([
                        'value' => [
                            new Assert\GreaterThanOrEqual(1),
                        ],
                    ]),
                ];
                break;
            case self::KUMN_KVTS:
                $keyNums = range(1, 10);
                $listConstraints = [];
                for ($i = 0; $i < 10; $i++) {
                    $listConstraints[$i] = [
                        new Assert\Collection([
                            'grade'.$keyNums[$i] => [
                                new Assert\GreaterThanOrEqual(1),
                                new Assert\LessThanOrEqual(10),
                            ],
                        ])
                    ];
                }
                $constraint = [
                    new Assert\Collection($listConstraints),
                ];
                break;
            case self::KP_KPVO:
                $constraint = [
                    new Assert\All([
                        new Assert\Collection([
                            'value' => [
                                new Assert\GreaterThanOrEqual(0),
                                new Assert\LessThanOrEqual(80),
                            ],
                            'minValue' => [],
                            'maxValue' => [],
                        ]),
                    ]),
                ];
                break;
            default:
                break;
        }

        return $constraint;
    }
}
