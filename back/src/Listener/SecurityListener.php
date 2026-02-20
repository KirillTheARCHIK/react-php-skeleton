<?php

namespace App\Listener;

use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ControllerArgumentsEvent;
use Symfony\Component\HttpKernel\Event\KernelEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

class SecurityListener implements EventSubscriberInterface
{
    private TokenStorageInterface $tokenStorage;
    private AuthorizationCheckerInterface $authChecker;
    private ParameterBagInterface $parameterBag;

    public function __construct(
        ParameterBagInterface $parameterBag,
        TokenStorageInterface $tokenStorage = null,
        AuthorizationCheckerInterface $authChecker = null
    ) {
        $this->tokenStorage = $tokenStorage;
        $this->authChecker = $authChecker;
        $this->parameterBag = $parameterBag;
    }

    /**
     * @param ControllerArgumentsEvent $event
     *
     * @return void
     *
     * @throws \ReflectionException
     */
    public function onKernelControllerArguments(KernelEvent $event)
    {
        $request = $event->getRequest();
        if (!$configurations = $request->attributes->get('_security')) {
            return;
        }

        if (null === $this->tokenStorage) {
            throw new \LogicException('To use the @Security tag, you need to install the Symfony Security bundle.');
        }

        if (null === $this->tokenStorage->getToken()) {
            throw new AccessDeniedException('No user token or you forgot to put your controller behind a firewall while using a @Security tag.');
        }
        $roleHierarchy = $this->parameterBag->get('security.role_hierarchy.roles');
        $controller = $event->getController()[0];
        $reflectionControllerClass = new \ReflectionClass($controller);
        if ($reflectionControllerClass->hasProperty('roleSlug')) {
            $role = sprintf('ROLE_%s_%s', strtoupper($controller::$roleSlug), strtoupper($configurations->getAction()));
        } elseif (!$reflectionControllerClass->hasMethod('getEntityName')) {
            $role = sprintf('ROLE_%s', strtoupper($configurations->getAction()));
        } else {
            $class = $controller->getEntityName();
            $reflect = new \ReflectionClass($class);
            $role = sprintf('ROLE_%s_%s', strtoupper($reflect->getShortName()), strtoupper($configurations->getAction()));
        }

        if (!$this->roleExists($role, $roleHierarchy, false)) {
            throw new \Exception("Cannot checking user permissions, because generated role isn't found in Role Hierarchy");
        }

        $user = $this->tokenStorage->getToken()->getUser();

        if (!$this->authChecker->isGranted($role, $user)) {
            throw new AccessDeniedException();
        }
    }

    private function roleExists($needle, $haystack, $strict = false): bool
    {
        foreach ($haystack as $item) {
            if (($strict ? $item === $needle : $item == $needle) || (is_array($item) && $this->roleExists($needle, $item, $strict))) {
                return true;
            }
        }

        return false;
    }

    public static function getSubscribedEvents(): array
    {
        return [KernelEvents::CONTROLLER_ARGUMENTS => 'onKernelControllerArguments'];
    }
}
