# Step-by-step - Test it or Die Trying (35')

## Calculator

- On commence par un premier cas simple : `9 + 3 = 12`
  - On crée le fichier `tests/calculator.test.ts`
  - On importe `describe`, `it`, `expect` depuis `vitest`
  - On applique le pattern `3A`

```typescript
import { describe, expect, it } from "vitest";
import { Calculator, ADD } from "../src/Calculator";

describe("Calculator", () => {
  it("should support add", () => {
    // Arrange
    const calculator = new Calculator();

    // Act
    const result = calculator.calculate(9, 3, ADD);

    // Assert
    expect(result).toBe(12);
  });
});
```

- Avec un premier test vert, on peut répéter pour les autres cas

```text
✅ 9 + 3 = 12
3 x 76 = 228
9 / 3 = 3
9 - 3 = 6
Unsupported operator should fail
```

- Les autres opérateurs

```typescript
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
```

- Le cas d'échec avec opérateur non supporté

```typescript
it("should throw when operator is not supported", () => {
  const calculator = new Calculator();

  expect(() => calculator.calculate(9, 3, "UnsupportedOperator"))
    .toThrowError("Not supported operator");
});
```

```text
✅ 9 + 3 = 12
✅ 3 x 76 = 228
✅ 9 / 3 = 3
✅ 9 - 3 = 6
✅ Unsupported operator should fail
```

### Refactoriser les tests

> On doit apporter le même soin aux tests qu'au code de production.

- Il y a de la duplication : on instancie un `Calculator` dans chaque test alors qu'il n'a pas d'état
- Vitest propose `it.each` pour les tests paramétrés

```typescript
describe("Calculator", () => {
  it.each([
    [9,  3,  ADD,      12],
    [3,  76, MULTIPLY, 228],
    [9,  3,  DIVIDE,   3],
    [9,  3,  SUBTRACT, 6],
  ])("calculate(%i, %i, %s) should equal %i", (a, b, operator, expected) => {
    const calculator = new Calculator();
    expect(calculator.calculate(a, b, operator)).toBe(expected);
  });

  it("should throw when operator is not supported", () => {
    expect(() => new Calculator().calculate(9, 3, "UnsupportedOperator"))
      .toThrowError("Not supported operator");
  });
});
```

> Un cas non couvert : que se passe-t-il si on divise par 0 ?

```text
✅ 9 + 3 = 12
✅ 3 x 76 = 228
✅ 9 / 3 = 3
✅ 9 - 3 = 6
✅ Unsupported operator should fail
Divide by 0 should fail
```

## TimeUtility

- Écrivons au moins un test

```typescript
export class TimeUtility {
  getTimeOfDay(): string {
    const hour = new Date().getHours();

    if (hour < 6)  return "Night";
    if (hour < 12) return "Morning";
    if (hour < 18) return "Afternoon";
    return "Evening";
  }
}
```

- Le test le plus simple que l'on puisse écrire

```typescript
it("should be afternoon", () => {
  expect(new TimeUtility().getTimeOfDay()).toBe("Afternoon");
});
```

- Ce test n'est pas répétable : le résultat dépend de l'heure système au moment de l'exécution
  - Le design est couplé à `new Date()` à l'intérieur de la méthode
  - Il faut pouvoir substituer la source de temps

- Exemples à couvrir

```text
06:00 -> Morning
02:00 -> Night
13:00 -> Afternoon
23:00 -> Evening
```

### Utiliser une interface Clock

- On introduit une interface `Clock` avec une méthode `now(): Date`
- On l'injecte dans le constructeur de `TimeUtility`

```typescript
// src/Clock.ts
export interface Clock {
  now(): Date;
}

// src/TimeUtility.ts
import type { Clock } from "./Clock";

export class TimeUtility {
  constructor(private readonly clock: Clock) {}

  getTimeOfDay(): string {
    const hour = this.clock.now().getHours();

    if (hour < 6)  return "Night";
    if (hour < 12) return "Morning";
    if (hour < 18) return "Afternoon";
    return "Evening";
  }
}
```

- Le code n'a plus de dépendance câblée en dur
- On peut maintenant substituer `Clock` dans les tests avec `vi.fn()`

```typescript
import { describe, expect, it, vi } from "vitest";
import { TimeUtility } from "../src/TimeUtility";
import type { Clock } from "../src/Clock";

function clockAt(hour: number): Clock {
  return { now: vi.fn().mockReturnValue(new Date(2011, 0, 1, hour, 0, 0)) };
}

describe("TimeUtility", () => {
  it("should return Morning for 6AM", () => {
    expect(new TimeUtility(clockAt(6)).getTimeOfDay()).toBe("Morning");
  });
```

```text
✅ 06:00 -> Morning
02:00 -> Night
13:00 -> Afternoon
23:00 -> Evening
```

- On couvre tous les cas avec `it.each`

```typescript
  it.each([
    [0,  "Night"],
    [4,  "Night"],
    [6,  "Morning"],
    [9,  "Morning"],
    [12, "Afternoon"],
    [17, "Afternoon"],
    [18, "Evening"],
    [23, "Evening"],
  ])("hour %i should return %s", (hour, expected) => {
    expect(new TimeUtility(clockAt(hour)).getTimeOfDay()).toBe(expected);
  });
});
```

```text
✅ 06:00 -> Morning
✅ 02:00 -> Night
✅ 13:00 -> Afternoon
✅ 23:00 -> Evening
```

> Ne jamais faire confiance à un test qu'on n'a pas vu échouer.
