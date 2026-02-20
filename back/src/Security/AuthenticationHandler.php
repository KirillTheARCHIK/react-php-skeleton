<?php

namespace App\Security;

use App\Controller\SecurityController;
use App\Entity\Integration\Driver;
use App\Entity\RepairCenter;
use App\Entity\TechTaxi\TransportationParticipant;
use App\Entity\UserEvent;
use App\Entity\UserEventType;
use App\Listener\Doctrine\BlameableListener;
use App\Serializer\RelationNormalizer;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Exception\ORMException;
use Doctrine\ORM\OptimisticLockException;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\SwitchUserToken;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Exception\DisabledException;
use Symfony\Component\Security\Core\User\InMemoryUser;
use Symfony\Component\Security\Http\Authentication\AuthenticationFailureHandlerInterface;
use Symfony\Component\Security\Http\Authentication\AuthenticationSuccessHandlerInterface;
use Symfony\Component\Security\Http\Event\LogoutEvent;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\SerializerInterface;

class AuthenticationHandler implements AuthenticationSuccessHandlerInterface, AuthenticationFailureHandlerInterface, EventSubscriberInterface
{
    /**
     * AuthenticationHandler constructor.
     *
     * @param EntityManager $manager
     */
    public function __construct(
        protected EntityManagerInterface $manager,
        protected BlameableListener $listener,
        protected SerializerInterface $serializer,
        protected Security $security,
    ) {
    }

    /**
     * @throws OptimisticLockException
     * @throws ORMException
     */
    public function onAuthenticationSuccess(Request $request, TokenInterface $token): Response
    {
        $this->saveEvent(UserEventType::LOGIN, null, $token->getUser());
        $user = $token->getUser();
        if ($user instanceof InMemoryUser) {
            $user = SecurityController::convertUser($user);
        }

        $token = $this->security->getToken();

        return new Response($this->serializer->serialize($user, 'json', [
            AbstractNormalizer::GROUPS => ['View', 'Profile'],
        ]));
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): Response
    {
        $previous = $exception->getPrevious();
        if ($previous instanceof DisabledException) {
            return (new Response($this->serializer->serialize(['errors' => $previous->getMessage()], 'json')))->setStatusCode(403);
        }

        return (new Response($this->serializer->serialize(['errors' => $exception->getMessage()], 'json')))->setStatusCode(401);
    }

    /**
     * @throws OptimisticLockException
     * @throws ORMException
     */
    public function onLogoutSuccess(LogoutEvent $event): void
    {
        $user = $event->getToken()->getUser();
        $this->saveEvent(UserEventType::LOGOUT, null, $user);
    }

    /**
     * @throws OptimisticLockException
     * @throws ORMException
     */
    public function saveEvent($eventType, $description = null, $user = null): void
    {
        $event = new UserEvent();
        $event
            ->setType($eventType, UserEventType::getRuType($eventType))
            ->setDescription($description)
            ->setEntityName('authorization', 'Авторизация');

        if ($user) {
            $this->listener->setUserValue($user);
            $event->setUser($user);
        }

        $this->manager->persist($event);
        $this->manager->flush($event);
    }

    public static function getSubscribedEvents(): array
    {
        return [LogoutEvent::class => 'onLogoutSuccess'];
    }
}
