<?php

namespace App\Extension\Doctrine;

use Doctrine\ORM\Query\AST\Functions\FunctionNode;
use Doctrine\ORM\Query\TokenType;
use Doctrine\ORM\Query\Parser;
use Doctrine\ORM\Query\SqlWalker;

class DistinctOn extends FunctionNode
{
    public $field;

    public function getSql(SqlWalker $sqlWalker): string
    {
        return sprintf("DISTINCT ON (%s) TRUE", $this->field->dispatch($sqlWalker));
    }

    public function parse(Parser $parser): void
    {
        $parser->match(TokenType::T_IDENTIFIER);
        $parser->match(TokenType::T_OPEN_PARENTHESIS);

        $this->field = $parser->StringPrimary();

        $parser->match(TokenType::T_CLOSE_PARENTHESIS);
    }
}
