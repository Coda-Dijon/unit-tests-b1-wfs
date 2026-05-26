export const ADD = "add";
export const MULTIPLY = "multiply";
export const DIVIDE = "divide";
export const SUBTRACT = "subtract";

type Operator = (a: number, b: number) => number;

const supportedOperators: Record<string, Operator> = {
  [ADD]: (a, b) => a + b,
  [MULTIPLY]: (a, b) => a * b,
  [DIVIDE]: (a, b) => a / b,
  [SUBTRACT]: (a, b) => a - b,
};

export class Calculator {
  calculate(a: number, b: number, operator: string): number {
    if (!(operator in supportedOperators)) {
      throw new Error("Not supported operator");
    }
    return supportedOperators[operator](a, b);
  }
}
