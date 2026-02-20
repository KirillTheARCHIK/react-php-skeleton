<?php

namespace App\Service\Utility;

class SSEHelper
{
    public static function send($eventName, array $data)
    {
        echo "event: $eventName".PHP_EOL;
        echo sprintf('data: %s'.PHP_EOL, json_encode($data));
        echo PHP_EOL.PHP_EOL;
        @ob_flush();
        @flush();
    }
}
