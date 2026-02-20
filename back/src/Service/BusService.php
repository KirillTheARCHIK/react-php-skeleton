<?php

namespace App\Service;

use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

readonly class BusService
{
    public function __construct(
        private HttpClientInterface                                     $client,
        #[Autowire('@app.bus.serializer')] private SerializerInterface  $serializer,
        #[Autowire("%env(EXAMPLE)%")] private string                 $exampleHost,
    ) {
    }
}
