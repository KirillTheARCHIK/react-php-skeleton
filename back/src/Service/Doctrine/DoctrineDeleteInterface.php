<?php

namespace App\Service\Doctrine;

use Doctrine\ORM\QueryBuilder;

interface DoctrineDeleteInterface
{
    public function deleteAll($className, QueryBuilder $builder = null);
}
