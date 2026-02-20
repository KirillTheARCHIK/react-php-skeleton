<?php
/**
 * Created by PhpStorm.
 * User: ilya
 * Date: 03.07.19
 * Time: 18:31.
 */

namespace App\Listener\Doctrine;

use App\Attribute\ExportEntity;
use App\Entity\UserEvent;
use App\Entity\UserEventType;
use App\Service\Utility\AttributeHelper;
use Doctrine\Common\EventArgs;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Event\PostPersistEventArgs;
use Doctrine\ORM\Mapping\ClassMetadata;
use Gedmo\Loggable\LogEntryInterface;
use Gedmo\Loggable\LoggableListener as BaseLoggableListener;
use Gedmo\Loggable\Mapping\Event\LoggableAdapter;
use Gedmo\Tool\Wrapper\AbstractWrapper;

class LoggableListener extends BaseLoggableListener
{
    public function __construct()
    {
        parent::__construct();
    }

    public function onFlush(EventArgs $eventArgs): void
    {
        if (null === $this->username) {
            return;
        }
        parent::onFlush($eventArgs);
    }

    /**
     * Create a new Log instance.
     *
     * @param string $action
     * @param object $object
     *
     * @throws \ReflectionException
     */
    protected function createLogEntry($action, $object, LoggableAdapter $ea): ?UserEvent
    {
        /** @var EntityManagerInterface $om */
        $om = $ea->getObjectManager();
        $wrapped = AbstractWrapper::wrap($object, $om);
        /** @var ClassMetadata $meta */
        $meta = $wrapped->getMetadata();
        $tableName = $meta->getTableName();
        $reflectionClass = new \ReflectionClass($meta->getName());

        if ($config = $this->getConfiguration($om, $meta->getName())) {
            $logEntry = new UserEvent();
            $logEntry->setType($action, UserEventType::getRuType($action));
            $exportAnnotation = AttributeHelper::getAttribute($reflectionClass, ExportEntity::class);
            $logEntry->setEntityName($tableName, $exportAnnotation ? $exportAnnotation->title : $tableName);

            // check for the availability of the primary key
            $uow = $om->getUnitOfWork();
            $objectId = $wrapped->getIdentifier();
            if (LogEntryInterface::ACTION_CREATE === $action && $ea->isPostInsertGenerator($meta)) {
                $this->pendingLogEntryInserts[spl_object_hash($object)] = $logEntry;
            }
            $logEntry->setDescription($this->getEventDescription($object, $objectId));

            if (LogEntryInterface::ACTION_UPDATE === $action && isset($config['versioned'])) {
                $newValues = $this->getObjectChangeSetData($ea, $object, $logEntry);
                if (0 === count($newValues)) {
                    return null;
                }
            }

            $om->persist($logEntry);
            $uow->computeChangeSet($om->getClassMetadata(UserEvent::class), $logEntry);

            return $logEntry;
        }

        return null;
    }

    /**
     * Checks for inserted object to update its logEntry
     * foreign key.
     *
     * @param PostPersistEventArgs $args
     *
     * @return void
     */
    public function postPersist(EventArgs $args)
    {
        $ea = $this->getEventAdapter($args);
        $object = $args->getObject();
        /** @var EntityManagerInterface $om */
        $om = $ea->getObjectManager();
        $oid = spl_object_hash($object);
        $uow = $om->getUnitOfWork();
        if ($this->pendingLogEntryInserts && array_key_exists($oid, $this->pendingLogEntryInserts)) {
            $wrapped = AbstractWrapper::wrap($object, $om);

            $logEntry = $this->pendingLogEntryInserts[$oid];

            $id = $wrapped->getIdentifier();
            $uow->scheduleExtraUpdate($logEntry, [
                'description' => [$logEntry->getUsername(), $this->getEventDescription($object, $id)],
            ]);
            //            $ea->setOriginalObjectProperty($uow, spl_object_hash($logEntry), 'objectId', $id);
            unset($this->pendingLogEntryInserts[$oid]);
        }
    }

    protected function getEventDescription($object, $id = null)
    {
        if (!method_exists($object, '__toString')) {
            return $id;
        }

        return $id ? "$id: [$object]" : "[$object]";
    }

    /**
     * Returns an objects changeset data.
     *
     * @param LoggableAdapter $ea
     * @param object          $object
     * @param object          $logEntry
     *
     * @return array
     */
    protected function getObjectChangeSetData($ea, $object, $logEntry)
    {
        /** @var EntityManagerInterface $om */
        $om = $ea->getObjectManager();
        $wrapped = AbstractWrapper::wrap($object, $om);
        $meta = $wrapped->getMetadata();
        $config = $this->getConfiguration($om, $meta->getName());
        $uow = $om->getUnitOfWork();
        $newValues = [];

        foreach ($ea->getObjectChangeSet($uow, $object) as $field => $changes) {
            if (empty($config['versioned']) || !in_array($field, $config['versioned'])) {
                continue;
            }
            $value = $changes[1];
            if ($meta->isSingleValuedAssociation($field) && $value) {
                if ($wrapped->isEmbeddedAssociation($field)) {
                    $value = $this->getObjectChangeSetData($ea, $value, $logEntry);
                } else {
                    $oid = spl_object_hash($value);
                    $wrappedAssoc = AbstractWrapper::wrap($value, $om);
                    $value = $wrappedAssoc->getIdentifier(false);
                    if (!is_array($value) && !$value) {
                        $this->pendingRelatedObjects[$oid][] = [
                            'log' => $logEntry,
                            'field' => $field,
                        ];
                    }
                }
            }
            if ($changes[0] != $changes[1]) { // To didn't have equals values
                for ($i = 0; $i < 2; ++$i) {
                    if (is_object($changes[$i])) {
                        if ($changes[$i] instanceof \DateTime) { // d.m.Y H:i:s
                            $newValues[$field][$i] = $changes[$i]->format('d.m.Y');
                        } else {
                            $newValues[$field][$i] = (string) $changes[$i];
                        }
                    } else {
                        $newValues[$field][$i] = $changes[$i];
                    }
                }
            }
        }

        return $newValues;
    }
}
