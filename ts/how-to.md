# Test it or Die Trying (35')

- Le `package.json` contient déjà tout le nécessaire pour écrire et lancer des tests
```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "devDependencies": {
    "vitest": "^2.0.0",
    "typescript": "^5.4.0"
  }
}
```
- Documentation de `vitest` disponible [ici](https://vitest.dev/guide/)

## Calculator

- Écris quelques tests sur la classe `Calculator`
  - Quels sont les cas limites (*edge cases*) ?
  - Écris des tests pour eux aussi

```ts
export const ADD = "add";
export const MULTIPLY = "multiply";
export const DIVIDE = "divide";
export const SUBTRACT = "subtract";

export class Calculator {
  calculate(a: number, b: number, operator: string): number {
    if (!(operator in supportedOperators)) {
      throw new Error("Not supported operator");
    }
    return supportedOperators[operator](a, b);
  }
}
```

> You are not allowed to change production code

Step-by-step solution is available [here](../solutions/ts/step-by-step.md)

## TimeUtility

- Écris au moins un test pour la classe `TimeUtility`
  - Quel problème rencontres-tu ?

```ts
export class TimeUtility {
  getTimeOfDay(): string {
    const hour = new Date().getHours();

    if (hour < 6) return "Night";
    if (hour < 12) return "Morning";
    if (hour < 18) return "Afternoon";
    return "Evening";
  }
}
```

- Pour les *Test Doubles*, `vitest` fournit `vi.fn()` nativement : aucune dépendance supplémentaire n'est nécessaire
  - Documentation disponible [ici](https://vitest.dev/guide/mocking.html)

```ts
import { vi } from "vitest";

const myMock = vi.fn().mockReturnValue(new Date(2011, 0, 1, 6, 0, 0));
```

> Never trust a test that you have not seen failed

Step-by-step solution is available [here](../solutions/ts/step-by-step.md)
