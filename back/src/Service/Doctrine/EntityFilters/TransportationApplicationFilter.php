<?php

namespace App\Service\Doctrine\EntityFilters;

use App\Entity\TechTaxi\TransportationApplicationStatus;
use App\Entity\TechTaxi\WaypointStatus;
use App\Service\Doctrine\DoctrineSortingService;
use Doctrine\ORM\QueryBuilder;

class TransportationApplicationFilter implements EntityFilterInterface, EntitySortInterface
{
    public const APPLICATION_STATUS = 'applicationStatus';
    public const TYPE = 'type';
    public const TIMER_STATUS = 'timerStatus';
    public const STATE_TIMER = 'stateTimer';
    public function filter(array $where, QueryBuilder $builder): array
    {
        $result = [];
        if (isset($where[self::APPLICATION_STATUS]) && $where[self::APPLICATION_STATUS]) {
            switch ($where[self::APPLICATION_STATUS]) {
                case TransportationApplicationStatus::CREATED_SLUG:
                case TransportationApplicationStatus::EXECUTED_SLUG:
                case TransportationApplicationStatus::UNSATISFIED_SLUG:
                case TransportationApplicationStatus::CANCELLED_SLUG:
                case TransportationApplicationStatus::ABORT_SLUG:
                case TransportationApplicationStatus::DISTRIBUTED_SLUG:
                    $builder
                        ->andWhere($builder->expr()->eq('a.statusSlug', ':statusSlug'))
                        ->setParameter('statusSlug', $where[self::APPLICATION_STATUS]);
                    break;
                case WaypointStatus::CARGO_OPERATIONS_STARTED:
                    $builder
                        ->andWhere($builder->expr()->eq('a.statusSlug', ':statusSlug'))
                        ->setParameter('statusSlug', TransportationApplicationStatus::STARTED_SLUG)
                        ->andWhere($builder->expr()->in('a.currentPointStatusSlug', ':currentPointStatusSlug'))
                        ->setParameter('currentPointStatusSlug', [WaypointStatus::LOADING_STARTED_SLUG, WaypointStatus::UNLOADING_STARTED_SLUG]);
                    break;
                case WaypointStatus::CARGO_OPERATIONS_FINISHED:
                    $builder
                        ->andWhere($builder->expr()->eq('a.statusSlug', ':statusSlug'))
                        ->setParameter('statusSlug', TransportationApplicationStatus::STARTED_SLUG)
                        ->andWhere($builder->expr()->in('a.currentPointStatusSlug', ':currentPointStatusSlug'))
                        ->setParameter('currentPointStatusSlug', [WaypointStatus::LOADING_FINISHED_SLUG, WaypointStatus::UNLOADING_FINISHED_SLUG]);
                    break;
                case WaypointStatus::EXECUTION_APPLICATION_STARTED:
                    $builder
                        ->andWhere($builder->expr()->eq('a.statusSlug', ':statusSlug'))
                        ->setParameter('statusSlug', TransportationApplicationStatus::STARTED_SLUG)
                        ->andWhere($builder->expr()->eq('a.currentPointStatusSlug', ':currentPointStatusSlug'))
                        ->setParameter('currentPointStatusSlug', WaypointStatus::CREATED_SLUG);
                    break;
                default:
                    $builder
                        ->andWhere($builder->expr()->eq('a.statusSlug', ':statusSlug'))
                        ->setParameter('statusSlug', TransportationApplicationStatus::STARTED_SLUG)
                        ->andWhere($builder->expr()->eq('a.currentPointStatusSlug', ':currentPointStatusSlug'))
                        ->setParameter('currentPointStatusSlug', $where[self::APPLICATION_STATUS]);
                    break;
            }
            $result[self::APPLICATION_STATUS] = $where[self::APPLICATION_STATUS];
        }

        return $result;
    }

    public function sort(string $column, string $destination, QueryBuilder $queryBuilder): bool
    {
        if (!in_array(strtolower($destination), [DoctrineSortingService::DESC_SORT, DoctrineSortingService::ASC_SORT], true)) {
            throw new \UnexpectedValueException("Не корректное направление сортировки $destination для $column");
        }
        $now = (new \DateTime())->format('Y-m-d H:i:s');
        switch ($column) {
            case self::APPLICATION_STATUS:
                $queryBuilder
                    ->addSelect('a.status ' . self::APPLICATION_STATUS)
                    ->addSelect('a.currentPointStatusId AS HIDDEN pointStatusId')
                    ->addOrderBy($column, $destination)
                    ->addOrderBy('pointStatusId', $destination);
                return true;
            case self::TIMER_STATUS:
                $queryBuilder
                    ->leftJoin('a.currentPoint', 'currentPoint')
                    ->leftJoin('currentPoint.dynamicScheduleItem', 'dynamicScheduleItem')
                    ->addSelect('a.statusId AS HIDDEN ' . self::TIMER_STATUS)
                    ->addSelect('CASE 
                        WHEN a.currentPointStatusSlug = \''.WaypointStatus::LOADING_STARTED_SLUG. '\' OR a.currentPointStatusSlug = \''.WaypointStatus::UNLOADING_STARTED_SLUG. '\' 
                            THEN currentPoint.timeOnPoint + currentPoint.plannedOverTimeOnPoint - DATE_DIFF(\'' . $now . '\', currentPoint.updatedAt)
                        WHEN a.currentPointStatusSlug = \''.WaypointStatus::LOADING_FINISHED_SLUG. '\' OR a.currentPointStatusSlug = \''.WaypointStatus::UNLOADING_FINISHED_SLUG. '\'
                            THEN currentPoint.timeOnPoint + currentPoint.plannedOverTimeOnPoint - dynamicScheduleItem.realCargoTime
                        WHEN a.currentPointStatusSlug = \''.WaypointStatus::CREATED_SLUG. '\' OR a.currentPointStatusSlug = \''.WaypointStatus::VEHICLE_HEADING_SLUG. '\' OR
                            a.currentPointStatusSlug = \''.WaypointStatus::VEHICLE_ARRIVED_SLUG. '\' OR a.currentPointStatusSlug = \''.WaypointStatus::VEHICLE_LEFT_SLUG. '\'
                            THEN DATE_DIFF(\'' . $now . '\', dynamicScheduleItem.planArrivalTime)
                        ELSE currentPoint.timeOnPoint + currentPoint.plannedOverTimeOnPoint + DATE_DIFF(dynamicScheduleItem.planArrivalTime, a.updatedAt)
                         END AS HIDDEN timer')
                    ->addOrderBy($column, $destination)
                    ->addOrderBy('timer', $destination);
                return true;
            case self::STATE_TIMER:
                $queryBuilder
                    ->leftJoin('a.currentPoint', 'currentPoint')
                    ->addSelect('CASE WHEN a.statusSlug=\'' . TransportationApplicationStatus::STARTED_SLUG . '\' THEN DATE_DIFF(\'' . $now . '\', currentPoint.updatedAt) ELSE DATE_DIFF(\'' . $now . '\', a.updatedAt) END AS HIDDEN ' . self::STATE_TIMER)
                    ->addOrderBy($column, $destination);
                return true;
        }
        return false;
    }
}
