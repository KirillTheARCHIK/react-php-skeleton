<?php

namespace App\Controller\Builder;

use App\Service\Client\IntegrationClient;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;

trait HasIntegrationMethods
{
    public function showIntegration(IntegrationClient $client): Response
    {
        $response = $client->getDictionary(static::getEntityName());

        return $this->json($response, Response::HTTP_OK, [], [AbstractNormalizer::GROUPS => ['View', 'Logging']]);
    }

    public function disableIntegration(IntegrationClient $client): Response
    {
        $response = $client->changeActiveIntegration(static::getEntityName(), false);

        return $this->json($response, Response::HTTP_OK, [], [AbstractNormalizer::GROUPS => ['View', 'Logging']]);
    }

    public function enableIntegration(IntegrationClient $client): Response
    {
        $response = $client->changeActiveIntegration(static::getEntityName());

        return $this->json($response, Response::HTTP_OK, [], [AbstractNormalizer::GROUPS => ['View', 'Logging']]);
    }

    public function setIntegrationCron(Request $request, IntegrationClient $client): Response
    {
        $content = json_decode($request->getContent(), true);
        if (!isset($content['time'])) {
            throw new \InvalidArgumentException('Time field is required');
        }
        $response = $client->setDictionaryUpdateTime(static::getEntityName(), $content['time']);

        return $this->json($response, Response::HTTP_OK, [], [AbstractNormalizer::GROUPS => ['View', 'Logging']]);
    }

    public function startIntegration(IntegrationClient $client): Response
    {
        $response = $client->loadEntities(static::getEntityName());
        if (true === $response) {
            return $this->json('', Response::HTTP_OK);
        }

        return $this->json('', Response::HTTP_BAD_GATEWAY);
    }
}
