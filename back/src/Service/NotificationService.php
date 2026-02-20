<?php

namespace App\Service;

use App\Model\Notification\DischargeNeedApprovedNotification;
use App\Model\Notification\FailureDistributedTransportationApplicationNotification;
use App\Model\Notification\Notification;
use App\Model\Notification\RepairApplicationStatusNotification;
use App\Model\Notification\TransportationApplicationStatusNotification;
use App\Service\Storage\StorageInterface;
use Symfony\Component\Serializer\Exception\ExceptionInterface;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;
use Symfony\Component\Serializer\SerializerInterface;

class NotificationService
{
    public const TYPE_DEFAULT = 'default';

    public const TYPE_REPAIR_APPLICATION_STATUS = 'repair_application_status';

    public const TYPE_DISTRIBUTE_TRANSPORTATION_APPLICATION = 'distribute_transportation_application';

    public const TYPE_DISCHARGE_NEED_APPROVED ='discharge_need_approved';
    public const TYPE_TRANSPORTATION_APPLICATION_STATUS ='transportation_application_status';
    public const EXPIRED_TIME_RANGE = 48;

    public const TYPES_MAPPING = [
        self::TYPE_DEFAULT => Notification::class,
        self::TYPE_REPAIR_APPLICATION_STATUS => RepairApplicationStatusNotification::class,
        self::TYPE_DISTRIBUTE_TRANSPORTATION_APPLICATION => FailureDistributedTransportationApplicationNotification::class,
        self::TYPE_DISCHARGE_NEED_APPROVED => DischargeNeedApprovedNotification::class,
        self::TYPE_TRANSPORTATION_APPLICATION_STATUS => TransportationApplicationStatusNotification::class
    ];

    private StorageInterface $storage;
    private SerializerInterface $serializer;
    private DenormalizerInterface $denormalizer;

    private array $buffer = [];

    public function __construct(
        StorageInterface      $storage,
        SerializerInterface   $serializer,
        DenormalizerInterface $denormalizer
    ) {
        $this->storage = $storage;
        $this->serializer = $serializer;
        $this->denormalizer = $denormalizer;
    }

    public static function getNotificationStorageKey(string $username): string
    {
        return "notifications_$username";
    }

    private function getNotificationClass(object $normalized): string
    {
        $type = $normalized->type ?? null;
        return self::TYPES_MAPPING[$type];
    }

    /**
     * @param string $username
     * @return Notification[]
     * @throws ExceptionInterface
     */
    public function get(string $username): array
    {
        $now = new \DateTime();
        $key = self::getNotificationStorageKey($username);
        $storage = json_decode($this->storage->getValue($key)) ?? [];

        if (!is_array($storage)) {
            $storage=[];
        }

        $actualNotifications = [];

        foreach ($storage as $normalized) {
            /**
             * @var Notification $notification
             */
            $notification = $this->denormalizer->denormalize($normalized, $this->getNotificationClass($normalized));
            if (!($expiredAt = $notification->getExpiredAt()) || $expiredAt > $now) {
                $actualNotifications[] = $notification;
            }
        }

        $this->set($username, $actualNotifications);

        return $actualNotifications;
    }

    /**
     * @param string $username
     * @param Notification[] $notifications
     * @return void
     */
    public function set(string $username, array $notifications)
    {
        $key = self::getNotificationStorageKey($username);
        $serialized = $this->serializer->serialize($notifications, 'json');
        $this->storage->setValue($key, $serialized);
    }

    /**
     * @param string $username
     * @return int
     * @throws ExceptionInterface
     */
    public function count(string $username): int
    {
        return count($this->get($username));
    }

    /**
     * @param string $username
     * @param string $id
     * @return void
     * @throws ExceptionInterface
     */
    public function delete(string $username, string $id)
    {
        $notifications = $this->get($username);
        $filtered = array_values(array_filter($notifications, function (Notification $notification) use ($id) {
            return $notification->getId() !== $id;
        }));
        $this->set($username, $filtered);
    }

    public function deleteAll(string $username)
    {
        $this->set($username, []);
    }

    /**
     * @param string $username
     * @return Notification[]
     * @throws ExceptionInterface
     */
    public function getSent(string $username): array
    {
        $notifications = $this->get($username);
        return array_values(array_filter($notifications, function (Notification $notification) {
            return $notification->isSent();
        }));
    }

    /**
     * @param string $username
     * @return Notification[]
     * @throws ExceptionInterface
     */
    public function getNotSent(string $username): array
    {
        $notifications = $this->get($username);
        return array_values(array_filter($notifications, function (Notification $notification) {
            return !$notification->isSent();
        }));
    }

    /**
     * @param string $username
     * @param Notification[] $notificationsToMark
     * @return void
     * @throws ExceptionInterface
     */
    public function markAsSent(string $username, array $notificationsToMark)
    {
        $notifications = $this->get($username);
        foreach ($notifications as $notification) {
            if (in_array($notification, $notificationsToMark)) {
                $notification->setSent(true);
            }
        }
        $this->set($username, $notifications);
    }

    /**
     * @param string $username
     * @param Notification|Notification[] $values
     * @return void
     * @throws ExceptionInterface
     */
    public function append(string $username, $values)
    {
        if (!is_array($values)) {
            $values = [$values];
        }

        $this->buffer[$username] = array_merge($this->buffer[$username] ?? [], $values);
    }

    /**
     * @param string $username
     * @param ?string $id
     * @return void
     * @throws ExceptionInterface
     */
    public function markAsRead(string $username, ?string $id = null): void
    {
        $notifications = $this->get($username);

        foreach ($notifications as $notification) {
            if ($id === null || $notification->getId() === $id) {
                $notification->setRead(true);
            }
        }
        $this->set($username, $notifications);
    }

    public function flush()
    {
        if ($this->buffer) {
            foreach ($this->buffer as $username => $values) {
                $this->set($username, array_merge($this->get($username), $values));
            }

            $this->buffer = [];
        }
    }
}
