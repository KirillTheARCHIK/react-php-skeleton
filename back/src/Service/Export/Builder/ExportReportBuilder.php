<?php

namespace App\Service\Export\Builder;

use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ExportReportBuilder extends ExportCatalogBuilder implements BuilderInterface
{
    public const TYPE = 'report';

    protected function writeData(Worksheet $sheet, array $data, int $startLine = 2): int
    {
        $currentLine = $startLine;
        $previousCellValues = [];
        foreach ($data as $row) {
            $numericRow = $this->normalizeKeys($row);
            foreach ($numericRow as $column => $cell) {
                $letter = Coordinate::stringFromColumnIndex($column);
                if ($cell instanceof \DateTime) {
                    $cell = $cell->format('d.m.Y');
                }
                $previousCellValue = $previousCellValues[$column] ?? null;

                if ($previousCellValue != strval($cell)) {
                    $this->setCellValue($sheet, "$letter$currentLine", strval($cell));
                    $previousCellValues[$column] = strval($cell);
                } else {
                    $this->setCellValue($sheet, "$letter$currentLine", '');
                }
            }
            ++$currentLine;
        }

        return $currentLine;
    }

    public static function supports(string $type): bool
    {
        return self::TYPE === $type;
    }
}
