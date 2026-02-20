<?php

namespace App\Extension\Doctrine;

use Doctrine\ORM\Query\AST\Functions\FunctionNode;
use Doctrine\ORM\Query\AST\Literal;
use Doctrine\ORM\Query\TokenType;
use Doctrine\ORM\Query\Parser;
use Doctrine\ORM\Query\SqlWalker;

class GetJsonValue extends FunctionNode
{
    /**
     * @var Literal
     */
    public $fieldExpression = null;

    /**
     * @var Literal
     */
    public $keyExpression = null;

    public function parse(Parser $parser): void
    {
        $parser->match(TokenType::T_IDENTIFIER);
        $parser->match(TokenType::T_OPEN_PARENTHESIS);
        $this->fieldExpression = $parser->StringPrimary();
        $parser->match(TokenType::T_COMMA);
        $this->keyExpression = $parser->StringPrimary();
        $parser->match(TokenType::T_CLOSE_PARENTHESIS);
    }

    public function getSql(SqlWalker $sqlWalker): string
    {
        $field = $this->fieldExpression->dispatch($sqlWalker);
        $key = $this->keyExpression->dispatch($sqlWalker);

        return "$field->>$key";
    }
}
