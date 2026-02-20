<?php

namespace App\Extension\Doctrine;

use Doctrine\ORM\Query\AST\Functions\FunctionNode;
use Doctrine\ORM\Query\AST\Literal;
use Doctrine\ORM\Query\AST\PathExpression;
use Doctrine\ORM\Query\TokenType;
use Doctrine\ORM\Query\Parser;
use Doctrine\ORM\Query\SqlWalker;
use Doctrine\ORM\Mapping\FieldMapping;

class DateFormat extends FunctionNode
{
    public const DATETIME_FORMAT = 'DD.MM.YYYY HH24:MI:SS';
    public const DATE_FORMAT = 'DD.MM.YYYY';
    public const TIME_FORMAT = 'HH24:MI:SS';
    public const TIME_WITHOUT_SECONDS_FORMAT = 'HH24:MI';
    public const YEAR_FORMAT = 'YYYY';
    public const SHORT_YEAR_FORMAT = 'YY';

    public static function getFormat(FieldMapping $fieldMetadata): string
    {
        return $fieldMetadata->options['dateFormat']
            ?? self::getDefaultFormat($fieldMetadata->type);
    }

    public static function getDefaultFormat(string $type): string
    {
        switch ($type) {
            case 'time':
                return self::TIME_FORMAT;
            case 'date':
                return self::DATE_FORMAT;
            case 'datetime':
            default:
                return self::DATETIME_FORMAT;
        }
    }

    /**
     * @var PathExpression|FunctionNode
     */
    public $dateExpression = null;

    /**
     * @var Literal
     */
    public $patternExpression = null;

    public function parse(Parser $parser): void
    {
        $parser->match(TokenType::T_IDENTIFIER);
        $parser->match(TokenType::T_OPEN_PARENTHESIS);
        $this->dateExpression = $parser->ArithmeticPrimary();
        $parser->match(TokenType::T_COMMA);
        $this->patternExpression = $parser->StringPrimary();
        $parser->match(TokenType::T_CLOSE_PARENTHESIS);
    }

    public function getSql(SqlWalker $sqlWalker): string
    {
        $date = $this->dateExpression->dispatch($sqlWalker);
        $pattern = $this->patternExpression->dispatch($sqlWalker);

        return "TO_CHAR($date, $pattern)";
    }
}
