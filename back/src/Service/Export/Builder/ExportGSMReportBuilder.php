<?php

namespace App\Service\Export\Builder;

use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ExportGSMReportBuilder extends ExportCatalogBuilder implements BuilderInterface
{
    public const TYPE = 'gsm_report';

    protected function writeData(Worksheet $sheet, array $data, int $startLine = 2): int
    {
        $currentLine = $startLine;
        $previousCellValues = [];
        foreach ($data as $row) {
            $column = 1;
            foreach ($row as $columnName => $cell) {
                $letter = Coordinate::stringFromColumnIndex($column);
                if ($cell instanceof \DateTime) {
                    $cell = $cell->format('d.m.Y');
                }
                $previousCellValue = $previousCellValues[$columnName] ?? null;
                if ((isset($previousCellValues['governmentNumber'])
                        && $previousCellValues['governmentNumber'] != $row['governmentNumber'])
                    || $previousCellValue != strval($cell)
                    || in_array($columnName, ['shiftSpentFuel', 'avgGroup', 'deviation'])
                ) {
                    $this->setCellValue($sheet, "$letter$currentLine", strval($cell));
                } else {
                    $this->setCellValue($sheet, "$letter$currentLine", '');
                }

                ++$column;
            }
            $previousCellValues = $row;
            ++$currentLine;
        }

        return $currentLine;
    }

    public static function supports(string $type): bool
    {
        return self::TYPE === $type;
    }
}
