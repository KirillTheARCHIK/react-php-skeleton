<?php

namespace App\Service\Export\Builder;

use App\Entity\Builder\PositionableEntity;
use App\Entity\UserTask;
use App\Model\ExportMessageQueueModel;
use App\Service\Export\DataExtractor\CatalogDataExtractor;
use App\Service\Export\DataExtractor\DataExtractorInterface;
use App\Service\Storage\StorageInterface;
use Doctrine\ORM\EntityManagerInterface;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Writer\Exception;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class ExportCatalogBuilder implements BuilderInterface
{
    public const TYPE = 'catalog';

    public const LOAD_PER_PAGE_COUNT = 1000;

    public const STORAGE_KEY = 'export_progress';

    protected StorageInterface $storage;

    protected DataExtractorInterface $dataExtractor;

    protected EntityManagerInterface $em;

    public function __construct(
        StorageInterface       $storage,
        CatalogDataExtractor   $dataExtractor,
        EntityManagerInterface $em
    ) {
        $this->storage = $storage;
        $this->dataExtractor = $dataExtractor;
        $this->em = $em;
    }

    /**
     * @throws \ReflectionException
     * @throws Exception
     *
     * @var ExportMessageQueueModel
     */
    public function build($model): ?string
    {
        $userTask = $this->em->getRepository(UserTask::class)->findOneBy(['id' => $model->getEventId()]);
        try {
            $entityName = $model->getEntityName();
            error_log("Starting generation $entityName document...");
            $entriesCount = $this->dataExtractor->getValuesCount($entityName);
            $pageCount = ceil($entriesCount / self::LOAD_PER_PAGE_COUNT);

            $spreadsheet = new Spreadsheet();
            $sheet = $spreadsheet->getActiveSheet();
            $meta = $this->dataExtractor->getHeaders($entityName);
            $catalogName = $meta['name'];
            $currentLine = 6;
            for ($i = 1; $i <= $pageCount; ++$i) {
                if (1 === $i) {
                    $this->writeMetadata($sheet, $catalogName, $model->getUserName());
                    $currentLine = $this->writeHeaders($sheet, $meta['columns'], $currentLine);
                }
                $dataPart = $this->getPaginatedData($entityName, $i, $model);
                $currentLine = $this->writeData($sheet, $dataPart, $currentLine);
                unset($dataPart);
                $progress = ceil($i / $pageCount * 100);
                // Save progress percent to Redis
                $this->updateProgress($model->getEventId(), $progress);
            }

            $writer = new Xlsx($spreadsheet);
            $writer->save($model->getFilename());
            error_log("Generation $entityName document successful.");

            if ($userTask) {
                $userTask->setStatus(UserTask::FINISHED);
                $userTask->setFinishedAt(new \DateTime());
                $filepath = explode('/', $model->getFilename());
                $userTask->setFilename($filepath[count($filepath) - 1]);
                $this->em->flush();
                $this->removeFinished($model->getEventId());
            }

            return $model->getFilename();
        } catch (\Exception $exception) {
            if ($userTask) {
                $userTask->setStatus(UserTask::ERROR);
                $userTask->setFinishedAt(new \DateTime());
                $this->em->flush();
                $this->removeFinished($model->getEventId());
            }
            throw $exception;
        }
    }

    protected function updateProgress($eventId, $value)
    {
        $key = static::getCalculatedStorageKey($eventId);
        $this->storage->setValue($key, $value);
    }

    public static function getCalculatedStorageKey($eventId): string
    {
        return sprintf('%s_%s', self::STORAGE_KEY, $eventId);
    }

    protected function removeFinished($eventId)
    {
        $key = static::getCalculatedStorageKey($eventId);
        $this->storage->removeValue($key);
    }

    protected function writeMetadata(Worksheet $sheet, string $catalogName, string $userName)
    {
        $this->setCellValue($sheet, 'A2', 'Наименование', true);
        $this->setCellValue($sheet, 'A3', 'Пользователь', true);
        $this->setCellValue($sheet, 'A4', 'Дата и время', true);
        $this->setCellValue($sheet, 'B2', $catalogName);
        $this->setCellValue($sheet, 'B3', $userName);
        $this->setCellValue($sheet, 'B4', (new \DateTime())->format('d.m.Y H:i'));
    }

    protected function setCellValue(Worksheet $sheet, string $coordinate, $value, bool $isBold = false)
    {
        $cell = $sheet->getCell($coordinate);
        $cell->setValue($value);
        if ($isBold) {
            $cell->getStyle()->getFont()->setBold(true);
        }
    }

    protected function writeData(Worksheet $sheet, array $data, int $startLine = 2): int
    {
        $currentLine = $startLine;
        foreach ($data as $row) {
            $numericRow = $this->normalizeKeys($row);
            foreach ($numericRow as $column => $cell) {
                $letter = Coordinate::stringFromColumnIndex($column);
                if ($cell instanceof \DateTime) {
                    $cell = $cell->format('d.m.Y H:i:s');
                }
                $this->setCellValue($sheet, "$letter$currentLine", strval($cell));
            }
            ++$currentLine;
        }

        return $currentLine;
    }

    protected function writeHeaders(Worksheet $sheet, array $meta, int $currentLine = 1)
    {
        $metaNumeric = $this->normalizeKeys($meta);
        array_unshift($metaNumeric, 'id');
        unset($metaNumeric[0]);
        foreach ($metaNumeric as $column => $row) {
            $letter = Coordinate::stringFromColumnIndex($column);
            $sheet->getColumnDimension($letter)->setAutoSize(true);
            $this->setCellValue($sheet, "$letter$currentLine", strval($row['name']), true);
        }

        return $currentLine + 1;
    }

    public static function supports(string $type): bool
    {
        return self::TYPE === $type;
    }

    protected function normalizeKeys(array $array): array
    {
        $normalizedArray = array_values($array);
        array_unshift($normalizedArray, 'normalizedKey');
        unset($normalizedArray[0]);

        return $normalizedArray;
    }

    protected function getPaginatedData($entityName, $page, $model): array
    {
        $queryBuilder = $this->em->getRepository($entityName)->createQueryBuilder('a');

        $filter = $model->getFilter() ?? [];
        $column = $model->getColumn() ?? 'id';
        $destination = $model->getDestination() ?? 'desc';

        if (in_array(PositionableEntity::class, class_implements($entityName), true)) {
            if (!$model->getColumn()) {
                $queryBuilder->addOrderBy('a.' . PositionableEntity::POSITION_FIELD);
            }
        }

        return $this->dataExtractor->getPaginatedData(
            $entityName,
            $page,
            self::LOAD_PER_PAGE_COUNT,
            $queryBuilder,
            [
                CatalogDataExtractor::FILTER => $filter,
                CatalogDataExtractor::SORT_COLUMN => $column,
                CatalogDataExtractor::SORT_DESTINATION => $destination,
            ],
        );
    }
}
