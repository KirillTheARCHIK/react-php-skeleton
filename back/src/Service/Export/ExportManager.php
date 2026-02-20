<?php

namespace App\Service\Export;

use App\Entity\User;
use App\Entity\UserTask;
use App\Model\ExportMessageQueueModel;
use App\Service\Export\DataExtractor\CatalogDataExtractor;
use App\Service\Export\DataExtractor\DataExtractorInterface;
use App\Service\Utility\PathHelper;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\KernelInterface;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class ExportManager
{
    private MessageBusInterface $messageBus;

    private KernelInterface $kernel;
    private TokenStorageInterface $tokenStorage;

    private EntityManagerInterface $em;

    private DataExtractorInterface $dataExtractor;

    public function __construct(
        MessageBusInterface    $messageBus,
        KernelInterface        $kernel,
        TokenStorageInterface  $tokenStorage,
        EntityManagerInterface $em,
        CatalogDataExtractor   $dataExtractor
    ) {
        $this->messageBus = $messageBus;
        $this->kernel = $kernel;
        $this->tokenStorage = $tokenStorage;
        $this->em = $em;
        $this->dataExtractor = $dataExtractor;
    }

    public function export(string $className, Request $request): int
    {
        $eventId = (new \DateTime())->getTimestamp();
        $filter = $request->get('where');
        $column = $request->get('column');
        $destination = $request->get('sort');
        $user = $this->getUser();

        $userId = null;
        $name = method_exists($user, 'getUserIdentifier')
            ? $user->getUserIdentifier()
            : '';

        if ($user instanceof User) {
            $userId = $user->getId();
            $name = $user->getFirstName();
        }

        $this->messageBus->dispatch(
            new ExportMessageQueueModel(
                $eventId,
                $className,
                $this->getFilename(),
                $filter,
                $column,
                $destination,
                $userId,
                $name,
            )
        );
        $this->createUserTask($eventId, $className, $user);

        return $eventId;
    }

    private function createUserTask(int $eventId, string $catalogName, $user)
    {
        $meta = $this->dataExtractor->getHeaders($catalogName);

        $userTask = new UserTask();
        $userTask->setId($eventId);
        $userTask->setStartedAt(new \DateTime());
        $userTask->setType('export');
        if ($user instanceof User) {
            $userTask->setUser($user);
        }
        $userTask->setName($meta['name']);
        $this->em->persist($userTask);
        $this->em->flush();
    }

    private function getFilename(): string
    {
        $publicDir = PathHelper::getPublicDir($this->kernel->getProjectDir());

        return sprintf('%s/export/%s.xlsx', $publicDir, (new \DateTime())->getTimestamp());
    }

    public function getUser()
    {
        $token = $this->tokenStorage->getToken();
        $user = $token?->getUser();

        return $user;
    }
}
