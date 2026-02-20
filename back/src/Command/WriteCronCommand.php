<?php

namespace App\Command;

use App\Configuration\AppConfiguration;
use App\Model\RewriteCronDispatcherEvent;
use App\Service\YamlConfigService;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;

#[AsCommand('app:cron:write')]
class WriteCronCommand extends Command
{
    private string $projectDir;

    public function __construct(
        #[Autowire('%kernel.project_dir%')] string $projectDir,
        private readonly YamlConfigService         $configService,
        private readonly EventDispatcherInterface  $dispatcher,
    ) {
        $this->projectDir = $projectDir;
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        // $this->dispatcher->dispatch(new RewriteCronDispatcherEvent(
        //     $this->configService->getConfig()[AppConfiguration::APP_TECH_TAXI_MODULE][AppConfiguration::TECH_TAXI_TIME_PERIOD_REQUEST],
        //     $this->projectDir,
        // ), 'rewriteCron');
        return Command::SUCCESS;
    }
}
