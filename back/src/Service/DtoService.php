<?php

namespace App\Service;

use App\Entity\TechTaxi\DtoTransportationParticipant;
use App\Entity\TechTaxi\TransportationParticipant;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class DtoService
{
    public function __construct(
        protected EntityManagerInterface  $em,
        protected SerializerInterface     $serializer,
        protected ValidatorInterface    $validator,
    ) {
    }

    public function getViewObject($entity, string $className)
    {
        if (!$entity instanceof $className) {
            if (method_exists($className, 'createFromEntity')) {
                $entity = $className::createFromEntity($entity);
            } else {
                $entity = $this->em->getRepository($className)->findOneBy(['id' => $entity->getId()]);
            }
        }

        return $entity;
    }

    public function updateTransportationParticipant(
        TransportationParticipant $entity,
        DtoTransportationParticipant $dto
    ): TransportationParticipant {
        $entity->setPositionNumber($dto->getPositionNumber());
        $entity->setType($dto->getType());
        $entity->setName($dto->getName());
        $entity->setDescription($dto->getDescription());
        $entity->setShortName($dto->getShortName());
        $entity->setAddress($dto->getAddress());
        $entity->setLongitude($dto->getLongitude());
        $entity->setLatitude($dto->getLatitude());
        $entity->setAllowedRequest($dto->isAllowedRequest());
        $entity->setPhoneNumber($dto->getPhoneNumber());
        $entity->setEmail($dto->getEmail());
        $entity->setDirectorName($dto->getDirectorName());
        $entity->setResponsiblePerson($dto->getResponsiblePerson());
        $entity->setAdditionalPhoneNumber($dto->getAdditionalPhoneNumber());
        if ($dto->getAuthorId() instanceof User) {
            $entity->setAuthor($dto->getAuthorId());
        };
        if ($dto->getEditorId() instanceof User) {
            $entity->setEditor($dto->getEditorId());
        }
        $entity->setUpdatedAt($dto->getUpdatedAt());
        $entity->setParticipantsInn($dto->getInn());
        $entity->setParticipantsReasonCode($dto->getReasonCode());

        return $entity;
    }
}
