<?php

namespace App\Extension\Doctrine\NumericFunction;

use Doctrine\ORM\Query\AST\Functions\FunctionNode;
use Doctrine\ORM\Query\TokenType;
use Doctrine\ORM\Query\Parser;
use Doctrine\ORM\Query\SqlWalker;

class Round extends FunctionNode
{
    public $value = null;

    public $precision = null;

    public function getSql(SqlWalker $sqlWalker): string
    {
        $value = $this->value->dispatch($sqlWalker);
        $precision = $this->precision->dispatch($sqlWalker);
        return "ROUND($value, $precision)";
    }

    public function parse(Parser $parser): void
    {
        $parser->match(TokenType::T_IDENTIFIER);
        $parser->match(TokenType::T_OPEN_PARENTHESIS);
        $this->value = $parser->SimpleArithmeticExpression();
        $parser->match(TokenType::T_COMMA);
        $this->precision = $parser->ArithmeticPrimary();
        $parser->match(TokenType::T_CLOSE_PARENTHESIS);
    }
}
