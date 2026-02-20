<?php

namespace App\Service\Client;

use App\Attribute\IntegrationEntity;
use App\Entity\Integration\DictionaryInfo;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use App\Service\Utility\AttributeHelper;

class IntegrationClient
{
    /**
     * @var HttpClientInterface
     */
    protected $client;

    /**
     * @var SerializerInterface
     */
    protected $serializer;

    /**
     * @var EntityManagerInterface
     */
    protected $em;

    /**
     * @var Reader
     */
    protected $reader;

    /**
     * @var string
     */
    protected $integrationUrl;

    public function __construct(
        string $url,
        HttpClientInterface $client,
        SerializerInterface $serializer,
        EntityManagerInterface $em,
    ) {
        $this->client = $client;
        $this->serializer = $serializer;
        $this->em = $em;
        $this->integrationUrl = $url;
    }

    public function getDictionaryName(string $className)
    {
        $metadata = $this->em->getClassMetadata($className)->getReflectionClass();
        /** @var IntegrationEntity $annotation */
        $annotation = AttributeHelper::getAttribute($metadata, IntegrationEntity::class);
        if (!$annotation) {
            throw new \Exception('Integration entity not found');
        }

        return $annotation->mapping;
    }

    /**
     * @throws \Exception
     */
    public function getDictionary(string $className): ?DictionaryInfo
    {
        $dictionaryName = $this->getDictionaryName($className);
        $repository = $this->em->getRepository(DictionaryInfo::class);
        $dictionary = $repository->findOneBy(['key' => $dictionaryName]);
        if (!$dictionary) {
            throw new \Exception("Справочник с ключем $dictionaryName не найден");
        }

        return $dictionary;
    }

    /**
     * @param string $updateTime
     *
     * @return DictionaryInfo|array|null
     *
     * @throws ClientExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    public function setDictionaryUpdateTime(string $className, $updateTime): DictionaryInfo
    {
        $dictionary = $this->getDictionary($className);
        $dictionary->setUnloadingTime($updateTime);
        $this->client->request('PUT', $this->integrationUrl.'/update', [
            'body' => $dictionary->toIntegrationRequest(),
        ])->getContent();

        return $dictionary;
    }

    /**
     * @return DictionaryInfo|array|null
     *
     * @throws ClientExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    public function changeActiveIntegration(string $className, bool $active = true): DictionaryInfo
    {
        $dictionary = $this->getDictionary($className);
        $dictionary->setIsDisable(!$active);
        $this->client->request('PUT', $this->integrationUrl.'/update', [
            'body' => $dictionary->toIntegrationRequest(),
        ])->getContent();

        return $dictionary;
    }

    /**
     * @throws TransportExceptionInterface
     */
    public function loadEntities(string $className, ?array $params = []): bool
    {
        $dictionaryName = $this->getDictionaryName($className);
        $response = $this->client->request('POST', $this->integrationUrl.'/unload?dictionary_name='.$dictionaryName, $params);

        return Response::HTTP_OK === $response->getStatusCode();
    }


}
