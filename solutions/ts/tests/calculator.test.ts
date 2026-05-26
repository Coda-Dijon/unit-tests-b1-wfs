import { describe, expect, it } from "vitest";
import { Calculator, ADD, MULTIPLY, DIVIDE, SUBTRACT } from "../src/Calculator";

describe("Calculator", () => {
  it("should support add", () => {
    // Arrange
    const calculator = new Calculator();

    // Act
    const result = calculator.calculate(9, 3, ADD);

    // Assert
    expect(result).toBe(12);
  });

  it("should support multiply", () => {
    // Arrange
    const calculator = new Calculator();

    // Act
    const result = calculator.calculate(3, 76, MULTIPLY);

    // Assert
    expect(result).toBe(228);
  });

  it("should support divide", () => {
    // Arrange
    const calculator = new Calculator();

    // Act
    const result = calculator.calculate(9, 3, DIVIDE);

    // Assert
    expect(result).toBe(3);
  });

  it("should support subtract", () => {
    // Arrange
    const calculator = new Calculator();

    // Act
    const result = calculator.calculate(9, 3, SUBTRACT);

    // Assert
    expect(result).toBe(6);
  });

  it("should throw when operator is not supported", () => {
    const calculator = new Calculator();

    expect(() => calculator.calculate(9, 3, "UnsupportedOperator")).toThrowError(
      "Not supported operator"
    );
  });

  it.each([
    [0, 0, ADD, 0],
    [0, 1, ADD, 1],
    [1, 0, ADD, 1],
    [1, 1, ADD, 2],
  ])("add(%i, %i) should equal %i", (a, b, operator, expected) => {
    const calculator = new Calculator();
    expect(calculator.calculate(a, b, operator)).toBe(expected);
  });
});
