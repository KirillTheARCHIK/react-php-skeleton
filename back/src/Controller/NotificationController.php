<?php

namespace App\Controller;

use App\Service\NotificationService;
use App\Service\StreamedResponseService;
use App\Service\Utility\SSEHelper;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/v1/notifications')]
class NotificationController extends AbstractController
{
    private function getUsername(): ?string
    {
        $user = $this->getUser();
        if ($user) {
            return method_exists($user, 'getUserIdentifier')
                ? $user->getUserIdentifier()
                : '';
        }

        return null;
    }

    #[Route('', methods: 'GET')]
    public function getNotifications(
        NotificationService $notificationService,
        SerializerInterface $serializer
    ): Response {
        $username = $this->getUsername();

        $notifications = $notificationService->get($username);
        $response = $serializer->serialize([
            'entries' => $notifications,
            'total' => count($notifications)
        ], 'json');
        $notificationService->markAsSent($username, $notifications);

        return new Response($response, Response::HTTP_OK, ['Content-Type' => 'application/json']);
    }

    /**
     * @param Serializer $serializer
     */
    #[Route('/stream', methods: 'GET')]
    public function getNotificationsStream(
        StreamedResponseService $responseService,
        NotificationService     $notificationService,
        SerializerInterface     $serializer
    ): StreamedResponse {
        $username = $this->getUsername();
        $send = function ($notifications, $count) use ($serializer) {
            SSEHelper::send("notifications", [
                'entries' => $serializer->normalize($notifications),
                'total' => $count
            ]);
        };

        return $responseService->getStreamResponse(function () use ($username, $send, $notificationService) {
            $sentNotifications = $notificationService->getSent($username);
            $count = $notificationService->count($username);
            $send($sentNotifications, $count);
            $env = $_ENV['APP_ENV'];

            do {
                $notSentNotifications = $notificationService->getNotSent($username);
                $count = $notificationService->count($username);
                $send($notSentNotifications, $count);
                $notificationService->markAsSent($username, $notSentNotifications);

                if ($env === 'dev') {
                    return;
                }

                usleep(1000000);
            } while (!connection_aborted());
        });
    }

    #[Route('/{notificationId}', methods: 'DELETE')]
    public function deleteNotification(string $notificationId, NotificationService $notificationService): Response
    {
        $username = $this->getUsername();
        $notificationService->delete($username, $notificationId);
        return $this->json(['total' => $notificationService->count($username)], Response::HTTP_OK);
    }

    #[Route('/all', methods: 'DELETE', priority: 1)]
    public function deleteAllNotifications(NotificationService $notificationService): Response
    {
        $username = $this->getUsername();
        $notificationService->deleteAll($username);
        return $this->json(['total' => 0], Response::HTTP_OK);
    }

    #[Route('/read/{notificationId}', methods: 'PATCH')]
    public function updateReadAction(string $notificationId, NotificationService $notificationService): Response
    {
        $username = $this->getUsername();
        $notificationService->markAsRead($username, $notificationId);
        return $this->json(['total' => $notificationService->count($username)], Response::HTTP_OK);
    }

    #[Route('/read/all', methods: 'PATCH')]
    public function updateReadAllAction(NotificationService $notificationService): Response
    {
        $username = $this->getUsername();
        $notificationService->markAsRead($username);
        return $this->json(['total' => $notificationService->count($username)], Response::HTTP_OK);
    }
}
