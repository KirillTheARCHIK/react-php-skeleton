<?php

namespace App\Command;

use App\Service\YamlConfigService;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand('app:config:load-defaults')]
class GenerateDefaultConfigCommand extends Command
{
    public function __construct(private YamlConfigService $configService)
    {
        parent::__construct('app:config:load-defaults');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $this->configService->replaceAll($this->configService->getDefaults());

        return Command::SUCCESS;
    }
}
