<?php

namespace App\Entity;

use App\Repository\FilterTemplateRepository;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Gedmo\SoftDeleteable\Traits\SoftDeleteableEntity;
use Symfony\Component\Serializer\Attribute\Groups;
use Doctrine\DBAL\Types\Types;

/** Шаблон фильтров */
#[ORM\Entity(FilterTemplateRepository::class)]
#[ORM\Table("filter_templates")]
#[ORM\HasLifecycleCallbacks()]
#[Gedmo\Loggable()]
#[Gedmo\SoftDeleteable()]
class FilterTemplate
{
    use HasAuthor;
    use HasCreatedAt;
    use HasEditor;
    use HasUpdatedAt;
    use SoftDeleteableEntity;

    /** Идентификатор */
    #[ORM\Id]
    #[ORM\GeneratedValue("IDENTITY")]
    #[ORM\Column(type: Types::INTEGER, options: ["comment" => "Идентификатор"])]
    #[Groups(["View"])]
    protected ?int $id = null;

    /** Наименование фильтра в интерфейсе */
    #[ORM\Column(type: Types::STRING, options: ["comment" => "Наименование фильтра в интерфейсе"])]
    #[Groups(["View", "Create", "Edit"])]
    protected string $filterName;

    /** Идентификатор справочника */
    #[ORM\Column(type: Types::STRING, options: ["comment" => "Идентификатор справочника"])]
    #[Groups(["View", "Create", "Edit"])]
    protected string $catalogSlug;

    /** Наименование справочника */
    #[ORM\Column(type: Types::STRING, nullable: true, options: ["comment" => "Наименование справочника"])]
    #[Groups(["View"])]
    protected ?string $catalogName;

    /** Виден ли фильтр другим пользователям */
    #[ORM\Column(type: Types::BOOLEAN, options: ["comment" => "Виден ли фильтр другим пользователям"])]
    #[Groups(["View", "Create", "Edit"])]
    protected bool $public;

    /** Функциональное содержание фильтра */
    #[ORM\Column(type: Types::JSONB, options: ["comment" => "Функциональное содержание фильтра"])]
    #[Groups(["View", "Create", "Edit"])]
    protected array $filterContent;

    /**
     * @return int|null
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @param int|null $id
     */
    public function setId(?int $id): void
    {
        $this->id = $id;
    }

    /**
     * @return string
     */
    public function getFilterName(): string
    {
        return $this->filterName;
    }

    /**
     * @param string $filterName
     */
    public function setFilterName(string $filterName): void
    {
        $this->filterName = $filterName;
    }

    /**
     * @return string
     */
    public function getCatalogSlug(): string
    {
        return $this->catalogSlug;
    }

    /**
     * @param string $catalogSlug
     */
    public function setCatalogSlug(string $catalogSlug): void
    {
        $this->catalogSlug = $catalogSlug;
    }

    /**
     * @return string|null
     */
    public function getCatalogName(): ?string
    {
        return $this->catalogName;
    }

    /**
     * @param string|null $catalogName
     */
    public function setCatalogName(?string $catalogName): void
    {
        $this->catalogName = $catalogName;
    }

    /**
     * @return bool
     */
    public function isPublic(): bool
    {
        return $this->public;
    }

    /**
     * @param bool $public
     */
    public function setPublic(bool $public): void
    {
        $this->public = $public;
    }

    /**
     * @return array
     */
    public function getFilterContent(): array
    {
        return $this->filterContent;
    }

    /**
     * @param array $filterContent
     */
    public function setFilterContent(array $filterContent): void
    {
        $this->filterContent = $filterContent;
    }
}
