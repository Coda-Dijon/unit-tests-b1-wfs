<?php
use PHPUnit\Framework\TestCase;

require_once __DIR__ . "../../src/Calculator.php";

class CalculatorTests extends TestCase
{

  public function testCalculatorShouldSupportAdd() {
    // Arrange
    $calculator = new Calculator;
    
    // Act
    $result = $calculator->calculate(9, 3, Operators::Add);

    // Assert
    $this->assertSame(12, $result);
  }

  /**
   * @dataProvider additionProvider
   */
  public function testCalculatorShouldSupportAddWithDataProvider($a, $b, $operator, $expected) {
    // Arrange
    $calculator = new Calculator;
    
    // Act
    $result = $calculator->calculate($a, $b, $operator);

    // Assert
    $this->assertSame($expected, $result);
  }

  public function additionProvider() {
    return [
        'adding zeros'  => [0, 0, Operators::Add, 0],
        'zero plus one' => [0, 1, Operators::Add, 1],
        'one plus zero' => [1, 0, Operators::Add, 1],
        'one plus one'  => [1, 1, Operators::Add, 2]
    ];
  }

  public function testCalculatorShouldSupportMultiply() {
    // Arrange
    $calculator = new Calculator;

    // Act 
    $result = $calculator->calculate(3, 76, Operators::Multiply);

    // Assert
    $this->assertSame(228, $result);
  }

  public function testCalculatorShouldSupportDivide() {
    // Arrange
    $calculator = new Calculator;

    // Act 
    $result = $calculator->calculate(9, 3, Operators::Divide);

    // Assert
    $this->assertSame(3, $result);
  }

  public function testCalculatorShouldSupportSubstract() {
    // Arrange
    $calculator = new Calculator;

    // Act 
    $result = $calculator->calculate(9, 3, Operators::Substract);

    // Assert
    $this->assertSame(6, $result);
  }

  public function testCalculatorShouldFailWhenOperatorNotSupported() {

    $calculator = new Calculator;

    $this->expectException(Exception::class);
    $this->expectExceptionMessage("Unsupported operator UnsupportedOperator");

    $calculator->calculate(9, 3, "UnsupportedOperator");
  }

}

?>