<?php

namespace App\Entity\Integration;

use App\Entity\HasUpdatedAt;
use App\Annotation\ExportEntity;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Table(name="integration_dictionary_info")
 *
 * @ORM\Entity()
 *
 * @ExportEntity(title="Интеграция")
 */
class DictionaryInfo
{
    use HasUpdatedAt;

    public const MODE_HOURLY = 'hour';
    public const MODE_WEEKLY = 'week';
    public const MODE_DAILY = 'day';
    public const MODE_MONTHLY = 'month';

    public const SCHEDULE_INDEX_MINUTE = 0;
    public const SCHEDULE_INDEX_HOUR = 1;
    public const SCHEDULE_INDEX_DAY = 2;
    public const SCHEDULE_INDEX_WEEKDAY = 4;
    public const SCHEDULE_WILDCARD = '*';

    /**
     * @var int
     *
     * @ORM\Column(type="integer")
     *
     * @ORM\Id
     *
     * @ORM\GeneratedValue(strategy="IDENTITY")
     *
     * @Groups({"View"})
     */
    protected ?int $id;

    /**
     * @var string
     *
     * @ORM\Column(type="string", unique=true)
     *
     * @Groups({"View"})
     */
    protected string $key;

    /**
     * @var bool
     *
     * @ORM\Column(type="boolean")
     *
     * @Groups({"View"})
     */
    protected bool $isDisable;

    /**
     * @var string
     *
     * @ORM\Column(type="string")
     *
     * @Groups({"View"})
     */
    protected string $publicName;

    /**
     * @var string
     *
     * @ORM\Column(type="string")
     *
     * @Groups({"View"})
     */
    protected string $urlFrom;

    /**
     * @var string
     *
     * @ORM\Column(type="string")
     *
     * @Groups({"View"})
     */
    protected string $unloadingTime;

    /**
     * @var InformationSystem
     *
     * @ORM\ManyToOne(targetEntity="App\Entity\Integration\InformationSystem", fetch="LAZY")
     *
     * @ORM\JoinColumn(onDelete="SET NULL")
     *
     * @Groups({"View"})
     */
    protected InformationSystem $informationSystem;

    /**
     * @var ParseStrategy
     *
     * @ORM\ManyToOne(targetEntity="App\Entity\Integration\ParseStrategy", fetch="LAZY")
     *
     * @ORM\JoinColumn(onDelete="SET NULL")
     */
    protected ?ParseStrategy $parseStrategy;

    /**
     * @var array
     *
     * @ORM\Column(type="json")
     *
     * @Groups({"View"})
     */
    protected array $dependencies;

    /**
     * @var \DateTime|null
     *
     * @ORM\Column(type="datetime", nullable=true)
     *
     * @Groups({"View"})
     */
    protected ?\DateTime $lastSuccessAt;

    /**
     * @var \DateTime|null
     *
     * @ORM\Column(type="datetime", nullable=true)
     *
     * @Groups({"View"})
     */
    protected ?\DateTime $lastExecuteAt;

    /**
     * @var \DateTime|null
     *
     * @ORM\Column(type="datetime", nullable=true)
     *
     * @Groups({"View"})
     */
    protected ?\DateTime $lastStartAt;

    /**
     * @var \DateTime|null
     *
     * @ORM\Column(type="date", nullable=true)
     *
     * @Groups({"View"})
     */
    protected ?\DateTime $startDate;

    /**
     * @return string
     */
    public function getKey()
    {
        return $this->key;
    }

    /**
     * @param string $key
     */
    public function setKey($key): void
    {
        $this->key = $key;
    }

    /**
     * @return bool
     */
    public function isDisable()
    {
        return $this->isDisable;
    }

    /**
     * @param bool $isDisable
     */
    public function setIsDisable($isDisable): void
    {
        $this->isDisable = $isDisable;
    }

    /**
     * @return string
     */
    public function getPublicName()
    {
        return $this->publicName;
    }

    /**
     * @param string $publicName
     */
    public function setPublicName($publicName): void
    {
        $this->publicName = $publicName;
    }

    /**
     * @return string
     */
    public function getUrlFrom()
    {
        return $this->urlFrom;
    }

    /**
     * @param string $urlFrom
     */
    public function setUrlFrom($urlFrom): void
    {
        $this->urlFrom = $urlFrom;
    }

    /**
     * @return string
     */
    public function getUnloadingTime()
    {
        return $this->unloadingTime;
    }

    /**
     * @param string $unloadingTime
     */
    public function setUnloadingTime($unloadingTime): void
    {
        $this->unloadingTime = $unloadingTime;
    }

    /**
     * @return InformationSystem
     */
    public function getInformationSystem()
    {
        return $this->informationSystem;
    }

    /**
     * @param InformationSystem $informationSystem
     */
    public function setInformationSystem($informationSystem): void
    {
        $this->informationSystem = $informationSystem;
    }

    public function getParseStrategy(): ParseStrategy
    {
        return $this->parseStrategy;
    }

    public function setParseStrategy(ParseStrategy $parseStrategy): void
    {
        $this->parseStrategy = $parseStrategy;
    }

    public function getDependencies(): array
    {
        return $this->dependencies;
    }

    public function setDependencies(array $dependencies): void
    {
        $this->dependencies = $dependencies;
    }

    /**
     * @return \DateTime|null
     */
    public function getLastSuccessAt(): ?\DateTime
    {
        return $this->lastSuccessAt;
    }

    /**
     * @param \DateTime|null $lastSuccessAt
     * @return self
     */
    public function setLastSuccessAt(?\DateTime $lastSuccessAt): self
    {
        $this->lastSuccessAt = $lastSuccessAt;
        return $this;
    }

    /**
     * @return \DateTime|null
     */
    public function getLastExecuteAt(): ?\DateTime
    {
        return $this->lastExecuteAt;
    }

    /**
     * @param \DateTime|null $lastExecuteAt
     * @return self
     */
    public function setLastExecuteAt(?\DateTime $lastExecuteAt): self
    {
        $this->lastExecuteAt = $lastExecuteAt;
        return $this;
    }

    /**
     * @return \DateTime|null
     */
    public function getLastStartAt(): ?\DateTime
    {
        return $this->lastStartAt;
    }

    /**
     * @param \DateTime|null $lastStartAt
     * @return self
     */
    public function setLastStartAt(?\DateTime $lastStartAt): self
    {
        $this->lastStartAt = $lastStartAt;
        return $this;
    }

    /**
     * @return \DateTime|null
     */
    public function getStartDate(): ?\DateTime
    {
        return $this->startDate;
    }

    /**
     * @param \DateTime|null $startDate
     * @return self
     */
    public function setStartDate(?\DateTime $startDate): self
    {
        $this->startDate = $startDate;
        return $this;
    }

    /**
     * @return bool
     */
    public function isExecuting(): bool
    {
        return $this->lastStartAt > $this->lastExecuteAt;
    }

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return string
     *
     * @Groups({"View"})
     */
    public function getInterval(): string
    {
        $schedule = explode(' ', $this->unloadingTime);
        if ($schedule[self::SCHEDULE_INDEX_WEEKDAY] !== self::SCHEDULE_WILDCARD) {
            return self::MODE_WEEKLY;
        } elseif ($schedule[self::SCHEDULE_INDEX_DAY] !== self::SCHEDULE_WILDCARD) {
            return self::MODE_MONTHLY;
        } elseif ($schedule[self::SCHEDULE_INDEX_HOUR] !== self::SCHEDULE_WILDCARD) {
            return self::MODE_DAILY;
        } else {
            return self::MODE_HOURLY;
        }
    }

    public function toIntegrationRequest()
    {
        return [
            'id' => $this->getId(),
            'key' => $this->getKey(),
            'is_disable' => $this->isDisable(),
            'public_name' => $this->getPublicName(),
            'url_from' => $this->getUrlFrom(),
            'unloading_time' => $this->getUnloadingTime(),
            'information_system_id' => $this->getInformationSystem()->getId(),
            'parse_strategy_id' => $this->getInformationSystem()->getId(),
            'dependencies' => $this->getDependencies(),
            'updated_at' => $this->getUpdatedAt()
        ];
    }
}
