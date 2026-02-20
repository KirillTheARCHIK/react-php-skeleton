<?php

namespace App\Listener;

use App\Controller\Builder\AbstractCatalogController;
use App\Entity\User;
use App\Service\Doctrine\Scopes\ScopeTransportationParticipantFilter;
use Doctrine\ORM\EntityManagerInterface;
use App\Filter\SoftDeleteableFilter;
use Symfony\Component\HttpKernel\Event\{ControllerEvent};
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\KernelEvents;

class IgnoreFilterListener implements EventSubscriberInterface
{
    public function __construct(private EntityManagerInterface $em)
    {
    }

    public function onKernelController(ControllerEvent $event): void
    {
        if (!$event->isMainRequest()) {
            return;
        }

        $controllers = $event->getController();
        if (!is_array($controllers)) {
            return;
        }

        list($controller) = $controllers;

        if (!($controller instanceof AbstractController)) {
            return;
        }

        $filters = $this->em->getFilters();

        if ($controller instanceof AbstractCatalogController) {
            $entityName = $controller::getEntityName();
            $entityViewName = $controller::getEntityViewName();

            /** @var SoftDeleteableFilter $filter */
            $filter = $filters->getFilter('softdeleteable');
            $filter->addEnabled($entityName);
            $filter->addEnabled($entityViewName);
        }
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::CONTROLLER => 'onKernelController'
        ];
    }
}
