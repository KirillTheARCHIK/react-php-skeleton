<?php

namespace App\Entity;

class UserEventType
{
    public const LOGIN = 'login';
    public const LOGOUT = 'logout';

    public const RECORD_REMOVE = 'remove';
    public const RECORD_UPDATE = 'update';
    public const RECORD_CREATE = 'create';

    private static $typesMapping = [
        self::LOGIN => 'Выполнен вход в систему',
        self::LOGOUT => 'Выполнен выход из системы',
        self::RECORD_REMOVE => 'Удаление',
        self::RECORD_UPDATE => 'Обновление',
        self::RECORD_CREATE => 'Создание',
    ];

    public static function getTypesMapping(): array
    {
        return self::$typesMapping;
    }

    /**
     * @return array
     */
    public static function getTypes()
    {
        return array_keys(self::$typesMapping);
    }

    public static function getRuType(string $type): string
    {
        return self::$typesMapping[$type];
    }
}
