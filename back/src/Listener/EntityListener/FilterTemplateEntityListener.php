<?php

namespace App\Listener\EntityListener;

use App\Entity\FilterTemplate;
use App\Repository\FilterTemplateRepository;
use App\Service\CatalogService;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Event\PreUpdateEventArgs;

#[
    AsEntityListener(event: 'prePersist', entity: FilterTemplate::class),
    AsEntityListener(event: 'preUpdate', entity: FilterTemplate::class)
]
class FilterTemplateEntityListener
{
    public function __construct(
        protected EntityManagerInterface $em,
        protected CatalogService         $catalogService
    ) {
    }

    public function prePersist(FilterTemplate $entity): void
    {
        $catalogSlug = $entity->getCatalogSlug();
        $this->setCatalogName($entity, $catalogSlug);
        $this->checkUnique($entity, true);
    }

    public function preUpdate(FilterTemplate $entity, PreUpdateEventArgs $args): void
    {
        $changed = $args->getEntityChangeSet();

        if (isset($changed['catalogSlug'])) {
            $catalogSlug = $args->getNewValue('catalogSlug');
            $this->setCatalogName($entity, $catalogSlug);
        }

        if (isset($changed['catalogSlug']) || isset($changed['public']) || isset($changed['filterName'])) {
            $this->checkUnique($entity);
        }
    }

    private function setCatalogName(FilterTemplate $entity, string $catalogSlug): void
    {
        $catalogName = $this->catalogService->getCatalogName($catalogSlug);

        if (!$catalogName) {
            throw new \Exception(sprintf("Каталог с ключем %s не найден", $catalogSlug));
        }

        $entity->setCatalogName($catalogName);
    }

    private function checkUnique(FilterTemplate $entity, bool $new = false): void
    {
        /** @var FilterTemplateRepository $repo */
        $repo = $this->em->getRepository(FilterTemplate::class);
        if ($repo->sameFilterExists($entity, $new)) {
            throw new \Exception("Наименование фильтра должно быть уникальным");
        }
    }
}
