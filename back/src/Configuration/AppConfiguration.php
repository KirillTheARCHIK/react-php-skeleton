<?php

namespace App\Configuration;

use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;

class AppConfiguration implements ConfigurationInterface
{
    public const APP_CONFIG_NAMESPACE = 'app_config';

    public const TIME_FORMAT = 'H:i';

    public function getConfigTreeBuilder(): TreeBuilder
    {
        $treeBuilder = new TreeBuilder(self::APP_CONFIG_NAMESPACE);
        if (!method_exists($treeBuilder, 'getRootNode')) {
            return $treeBuilder;
        }
        $treeBuilder->getRootNode()
            ->children()
            ->end();
        return $treeBuilder;
    }
}
