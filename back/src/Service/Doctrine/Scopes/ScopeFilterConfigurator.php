<?php

namespace App\Service\Doctrine\Scopes;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\User\InMemoryUser;
use Symfony\Component\Security\Core\User\UserInterface;

class ScopeFilterConfigurator
{
    public const CONTRACTOR = 'contractor_filter';
    public const CONTRACTOR_ID = 'contractor_id';
    public const TRANSPORTATION_PARTICIPANT = 'transportation_participant_filter';
    public const TRANSPORTATION_PARTICIPANT_ID = 'participant_id';
    public const REPAIR_CENTER = 'repair_center-filter';
    public const REPAIR_CENTER_ID = 'repair_center_id';
    public const REPAIR_SUBDIVISION = 'repair-subdivision_filter';
    public const REPAIR_SUBDIVISION_ID = 'repair_subdivision_id';
    public const SUBDIVISION = 'subdivision_filter';
    public const SUBDIVISION_ID = 'subdivision_id';
    /**
     * @var EntityManagerInterface
     */
    protected $em;

    /**
     * @var TokenStorageInterface
     */
    protected $tokenStorage;

    public function __construct(EntityManagerInterface $em, TokenStorageInterface $tokenStorage)
    {
        $this->em = $em;
        $this->tokenStorage = $tokenStorage;
    }

    public function onKernelRequest()
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            return;
        }

        // if ($user->getRepairCenter() && $this->em->getFilters()->has(self::REPAIR_CENTER)) {
        //     $filterRepairCenter = $this->em->getFilters()->enable(self::REPAIR_CENTER);
        //     $filterRepairCenter->setParameter(self::REPAIR_CENTER_ID, $user->getRepairCenter()->getId());
        // }
    }

    public function getUser()
    {
        $token = $this->tokenStorage->getToken();
        $user = $token?->getUser();
        if (!($user instanceof User)) {
            return null;
        }

        return $user;
    }
}
