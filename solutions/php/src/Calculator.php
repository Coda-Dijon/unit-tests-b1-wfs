<?php

abstract class Operators {
  const Add = "add";
  const Multiply = "multiply";
  const Divide = "divide";
  const Substract = "substract";
}

class Calculator {
  
  private $supportedOperators;
  
  public function __construct() {
    $this->supportedOperators = [
      Operators::Add       => function ($a, $b) { return $a + $b; },
      Operators::Multiply  => function ($a, $b) { return $a * $b; },
      Operators::Divide    => function ($a, $b) { return $a / $b; },
      Operators::Substract => function ($a, $b) { return $a - $b; }
    ];
  }

  public function calculate($a, $b, $operator) {
    if(!array_key_exists($operator, $this->supportedOperators)) {
      throw new Exception("Unsupported operator {$operator}");
    }
    return $this->supportedOperators[$operator]($a, $b);
  }

}

?>