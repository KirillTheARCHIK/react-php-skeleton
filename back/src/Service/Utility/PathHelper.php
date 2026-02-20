<?php

namespace App\Service\Utility;

class PathHelper
{
    public const HTTP = 'http';
    public const HTTPS = 'https';
    public const PARENT_DIR = '..';

    public static function getHost()
    {
        $protocol = self::HTTP;
        $serverName = $_SERVER['SERVER_NAME'];
        $port = $_SERVER['SERVER_PORT']; // on env(PROD) port will be 80?
        if (self::HTTP !== strtolower(substr($_SERVER['SERVER_PROTOCOL'], 0, 4))) {
            $protocol = self::HTTPS;
        }

        return sprintf('%s://%s%s', $protocol, $serverName, '80' === $port ? '' : ':'.$port);
    }

    public static function getFileExtensionFromPath(string $filepath)
    {
        if (false !== strpos($filepath, '.')) {
            $splitValue = explode('.', $filepath);

            return end($splitValue);
        }

        return '';
    }

    /**
     * @return string
     */
    public static function getPublicDir(string $projectDir)
    {
        return $projectDir.DIRECTORY_SEPARATOR.'..'.DIRECTORY_SEPARATOR.('dev' === $_ENV['APP_ENV'] ? 'public' : 'build');
    }
}
