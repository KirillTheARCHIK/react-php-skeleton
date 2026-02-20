<?php

namespace App\Service;

use App\Configuration\AppConfiguration;
use App\Model\RewriteCronDispatcherEvent;
use Symfony\Component\Config\Definition\Processor;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Yaml\Yaml;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;

readonly class YamlConfigService
{
    private string $configPath;

    private string $projectDir;

    public function __construct(
        #[Autowire('%kernel.project_dir%')] string $projectDir,
        private EventDispatcherInterface           $dispatcher,
    ) {
        $this->configPath = sprintf('%s/app.yaml', $projectDir . '/config');
        $this->projectDir = $projectDir;
    }

    public function getConfig(): array
    {
        $config = Yaml::parse(
            file_get_contents($this->configPath)
        );

        $processor = new Processor();
        $configuration = new AppConfiguration();

        return $processor->processConfiguration(
            $configuration,
            [$config]
        );
    }

    public function validate(array $config): array
    {
        if (isset($config[AppConfiguration::APP_TECH_TAXI_MODULE][AppConfiguration::TECH_TAXI_TIME_ACCEPT_APP_NEXT_DAY]) &&
        $config[AppConfiguration::APP_TECH_TAXI_MODULE][AppConfiguration::TECH_TAXI_TIME_ACCEPT_APP_NEXT_DAY] > AppConfiguration::TECH_TAXI_TIME_ACCEPT_APP_NEXT_DAY_DEFAULT) {
            throw new \InvalidArgumentException('Время окончания приема предварительных заявок на КС следующего дня не может быть больше 17:00');
        }

        $processor = new Processor();
        $configuration = new AppConfiguration();

        return $processor->processConfiguration(
            $configuration,
            [$config]
        );
    }

    public function setParameterValue(string $module, string $parameter, mixed $value): array
    {
        $config = $this->getConfig();
        if (!isset($config[$module])) {
            throw new \InvalidArgumentException(sprintf('Parameter with name %s isn\'t found', $module));
        }

        if (!isset($config[$module][$parameter])) {
            throw new \InvalidArgumentException(sprintf('Parameter with name %s isn\'t found', $parameter));
        }

        $config[$module][$parameter] = $value;

        $processor = new Processor();
        $configuration = new AppConfiguration();
        $config = $processor->processConfiguration(
            $configuration,
            [$config]
        );

        $yaml = Yaml::dump($config);
        file_put_contents($this->configPath, $yaml);

        return $config;
    }

    public function getDefaults(): array
    {
        $processor = new Processor();
        $configuration = new AppConfiguration();
        $modules = [];

        return $processor->processConfiguration(
            $configuration,
            [$modules]
        );
    }

    public function replaceAll(array $config): array
    {
        $oldTimePeriodRequest = $this->getConfig()[AppConfiguration::APP_TECH_TAXI_MODULE][AppConfiguration::TECH_TAXI_TIME_PERIOD_REQUEST];
        if ($config[AppConfiguration::APP_TECH_TAXI_MODULE][AppConfiguration::TECH_TAXI_TIME_PERIOD_REQUEST] != $oldTimePeriodRequest) {
            $this->dispatcher->dispatch(new RewriteCronDispatcherEvent(
                $config[AppConfiguration::APP_TECH_TAXI_MODULE][AppConfiguration::TECH_TAXI_TIME_PERIOD_REQUEST],
                $this->projectDir,
            ), 'rewriteCron');
        }
        $yaml = Yaml::dump($config);
        $processor = new Processor();
        $configuration = new AppConfiguration();
        $config = $processor->processConfiguration(
            $configuration,
            [$config]
        );
        file_put_contents($this->configPath, $yaml);

        return $config;
    }
}
