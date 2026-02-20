<?php

namespace App\Model\Filter;

use Symfony\Component\Validator\Constraints as Assert;

class PaginationFilter
{
    private const DEFAULT_PAGE = 1;
    private const DEFAULT_LIMIT = 10;

    #[Assert\PositiveOrZero(message: 'Значение должно быть неотрицательным', groups: ['pagination'])]
    #[Assert\Range(notInRangeMessage: 'Допустимые значения от 1 до 100', min: 1, max: 100, groups: ['pagination'])]
    public ?string $page = null;

    #[Assert\PositiveOrZero(message: 'Значение должно быть неотрицательным', groups: ['pagination'])]
    #[Assert\Range(minMessage: 'Допустимые значения от 0', min: 0, groups: ['pagination'])]
    public ?string $limit = null;
    public function getPage(): string
    {
        return $this->page ?? self::DEFAULT_PAGE;
    }
    public function getLimit(): string
    {
        return $this->limit ?? self::DEFAULT_LIMIT;
    }

    /**
     * @param string|null $page
     * @return PaginationFilter
     */
    public function setPage(?string $page): PaginationFilter
    {
        $this->page = $page;
        return $this;
    }

    /**
     * @param string|null $limit
     * @return PaginationFilter
     */
    public function setLimit(?string $limit): PaginationFilter
    {
        $this->limit = $limit;
        return $this;
    }
}
