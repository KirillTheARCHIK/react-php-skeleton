<?php

namespace App\Listener\Doctrine;

use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Mapping\ClassMetadata;
use Doctrine\ORM\Mapping\MappingException;
use Doctrine\ORM\UnitOfWork;
use Doctrine\Persistence\NotifyPropertyChanged;
use Gedmo\Blameable\BlameableListener as BaseListener;
use Gedmo\Exception\InvalidArgumentException;
use Gedmo\Mapping\Event\AdapterInterface;
use Symfony\Component\PropertyAccess\PropertyAccess;

class BlameableListener extends BaseListener
{
    protected $user;

    /**
     * Updates a field.
     *
     * @param object           $object
     * @param AdapterInterface $eventAdapter
     * @param ClassMetadata    $meta
     * @param string           $field
     *
     * @throws MappingException
     */
    protected function updateField($object, $eventAdapter, $meta, $field)
    {
        $accessor = PropertyAccess::createPropertyAccessor();

        $oldValue = $accessor->getValue($object, $field);
        $newValue = $this->getFieldValue($meta, $field, $eventAdapter);

        // if field value is reference, persist object
        if ($meta->hasAssociation($field) && is_object($newValue) && method_exists($newValue, 'getId') && !$eventAdapter->getObjectManager()->contains($newValue)) {
            /** @var EntityManagerInterface $om */
            $om = $eventAdapter->getObjectManager();
            $uow = $om->getUnitOfWork();

            // Check to persist only when the entity isn't already managed, persists always for MongoDB
            if (!($uow instanceof UnitOfWork) || UnitOfWork::STATE_MANAGED !== $uow->getEntityState($newValue)) {
                if ($id = $om->getClassMetadata(get_class($newValue))->getIdentifierValues($newValue)) {
                    $uow->registerManaged($newValue, $id, []);
                } else {
                    $om->persist($newValue);
                }
            }
        }
        if ($meta->hasAssociation($field)) {
            $association = $meta->getAssociationMapping($field);
            $fieldType = $association['targetEntity'];
            if (!($newValue instanceof $fieldType)) {
                return;
            }
        }
        $accessor->setValue($object, $field, $newValue);

        if ($object instanceof NotifyPropertyChanged) {
            /** @var EntityManagerInterface $em */
            $em = $eventAdapter->getObjectManager();
            $uow = $em->getUnitOfWork();
            $uow->propertyChanged($object, $field, $oldValue, $newValue);
        }
    }

    /**
     * Get the user value to set on a blameable field.
     *
     * @param ClassMetadata $meta
     * @param string        $field
     *
     * @return mixed
     */
    public function getFieldValue($meta, $field, $eventAdapter)
    {
        if ($meta->hasAssociation($field)) {
            if (null !== $this->user && !is_object($this->user)) {
                return null;
            }

            return $this->user;
        }

        // ok so its not an association, then it is a string
        if (is_object($this->user)) {
            if (method_exists($this->user, 'getUsername')) {
                return (string) $this->user->getUsername();
            }
            if (method_exists($this->user, '__toString')) {
                return $this->user->__toString();
            }
            throw new InvalidArgumentException('Field expects string, user must be a string, or object should have method getUsername or __toString');
        }

        return $this->user;
    }
}
