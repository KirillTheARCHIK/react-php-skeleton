<?php

namespace App\Listener\Subscriber;

use App\Model\RewriteCronDispatcherEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class RewriteCronSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [
            'rewriteCron' => 'rewriteCron',
        ];
    }

    public function rewriteCron(RewriteCronDispatcherEvent $event): void
    {
        $time = $event->getTime();
        $projectDir = $event->getProjectDir();
        exec('crontab -r');
        exec("crontab -l | { cat; echo '55 23 * * * /usr/local/bin/php $projectDir/bin/console app:repair_application:statistics'; } | crontab -");
        exec("crontab -l | { cat; echo '* * * * * /usr/local/bin/php $projectDir/bin/console app:calendarshift:processing >> $projectDir/var/log/cron.log 2>&1'; } | crontab -");
        exec("crontab -l | { cat; echo '0 3,15 * * * /usr/local/bin/php $projectDir/bin/console app:driver-rating:calculate'; } | crontab -");
        exec("crontab -l | { cat; echo '*/10 * * * * /usr/local/bin/php $projectDir/bin/console app:transportation-participant:sync'; } | crontab -");
        exec("crontab -l | { cat; echo '" . substr($time, 3, 2) . " " . substr($time, 0, 2) . " * * * /usr/local/bin/php $projectDir/bin/console app:request:periodic:execute'; } | crontab -");
    }
}
