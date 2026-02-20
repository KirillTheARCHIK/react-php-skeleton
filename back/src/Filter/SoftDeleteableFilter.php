<?php

namespace App\Filter;

use Doctrine\ORM\Mapping\ClassMetadata;
use Gedmo\SoftDeleteable\Filter\SoftDeleteableFilter as BaseSoftDeleteableFilter;

/**
 * Класс переопределен для того, чтобы иметь фильтр включенным всегда
 * только для запрашиваемого объекта, а все дочерние внутри были доступны
 */
class SoftDeleteableFilter extends BaseSoftDeleteableFilter
{
    protected array $enabled = [];

    public function addFilterConstraint(ClassMetadata $targetEntity, $targetTableAlias): string
    {
        if (count($this->enabled) > 0) {

            $class = $targetEntity->getName();

            $config = $this->getListener()->getConfiguration($this->getEntityManager(), $targetEntity->name);

            if (!isset($config['softDeleteable']) || !$config['softDeleteable']) {
                return '';
            }

            if ($config['hardDelete']) {
                if ($this->isEnabledCheck($class)) {
                    return '';
                }

                if ($this->isEnabledCheck($targetEntity->rootEntityName)) {
                    return '';
                }
            }
        }

        return parent::addFilterConstraint($targetEntity, $targetTableAlias);
    }

    public function isEnabledCheck(string $class): bool
    {
        return !(isset($this->enabled[$class]) && true === $this->enabled[$class]);
    }

    /**
     * @param string $class
     *
     * @phpstan-param class-string $class
     *
     * @return void
     */
    public function removeEnabled($class): void
    {
        $this->enabled[$class] = false;
        // Make sure the hash (@see SQLFilter::__toString()) for this filter will be changed to invalidate the query cache.
        $this->setParameter(sprintf('disabled_%s', $class), false);
    }

    /**
     * @param string $class
     *
     * @phpstan-param class-string $class
     *
     * @return void
     */
    public function addEnabled($class): void
    {
        $this->enabled[$class] = true;
        // Make sure the hash (@see SQLFilter::__toString()) for this filter will be changed to invalidate the query cache.
        $this->setParameter(sprintf('disabled_%s', $class), true);
    }
}
