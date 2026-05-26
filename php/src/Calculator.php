<?php

abstract class Operators
{
    const ADD = "add";
    const MULTIPLY = "multiply";
    const DIVIDE = "divide";
    const SUBSTRACT = "substract";
}

class Calculator
{
    private array $supportedOperators;

    public function __construct()
    {
        $this->supportedOperators = [
            Operators::ADD => function ($a, $b) {
                return $a + $b;
            },
            Operators::MULTIPLY => function ($a, $b) {
                return $a * $b;
            },
            Operators::DIVIDE => function ($a, $b) {
                return $a / $b;
            },
            Operators::SUBSTRACT => function ($a, $b) {
                return $a - $b;
            }
        ];
    }

    /**
     * @throws Exception
     */
    public function calculate($a, $b, $operator)
    {
        if (!array_key_exists($operator, $this->supportedOperators)) {
            throw new Exception("Unsupported operator {$operator}");
        }
        return $this->supportedOperators[$operator]($a, $b);
    }
}

?>