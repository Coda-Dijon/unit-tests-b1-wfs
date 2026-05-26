# Step-by-step - Test it or Die Trying (35')

## Calculator

- On commence par un premier cas simple : `9 + 3 = 12`
  - On crée la classe `CalculatorTests` dans `tests/`
  - On utilise le pattern `3A` pour le structurer
  - On fait hériter de `TestCase` (PHPUnit)

```php
use PHPUnit\Framework\TestCase;
require_once __DIR__ . '/../src/Calculator.php';

class CalculatorTests extends TestCase
{
    public function testCalculatorShouldSupportAdd(): void
    {
        // Arrange
        $calculator = new Calculator();

        // Act
        $result = $calculator->calculate(9, 3, Operators::Add);

        // Assert
        $this->assertSame(12, $result);
    }
}
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

```php
public function testCalculatorShouldSupportMultiply(): void
{
    // Arrange
    $calculator = new Calculator();

    // Act
    $result = $calculator->calculate(3, 76, Operators::Multiply);

    // Assert
    $this->assertSame(228, $result);
}

public function testCalculatorShouldSupportDivide(): void
{
    // Arrange
    $calculator = new Calculator();

    // Act
    $result = $calculator->calculate(9, 3, Operators::Divide);

    // Assert
    $this->assertSame(3, $result);
}

public function testCalculatorShouldSupportSubstract(): void
{
    // Arrange
    $calculator = new Calculator();

    // Act
    $result = $calculator->calculate(9, 3, Operators::Substract);

    // Assert
    $this->assertSame(6, $result);
}
```

- Le cas d'échec avec opérateur non supporté

```php
public function testCalculatorShouldFailWhenOperatorNotSupported(): void
{
    $calculator = new Calculator();

    $this->expectException(Exception::class);
    $this->expectExceptionMessage("Unsupported operator UnsupportedOperator");

    $calculator->calculate(9, 3, "UnsupportedOperator");
}
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
- En PHPUnit on peut utiliser un `@dataProvider` pour les tests paramétrés

```php
class CalculatorTests extends TestCase
{
    /**
     * @dataProvider operationsProvider
     */
    public function testCalculatorShouldSupportOperations(
        int $a, int $b, string $operator, int $expected
    ): void {
        $calculator = new Calculator();
        $this->assertSame($expected, $calculator->calculate($a, $b, $operator));
    }

    public function operationsProvider(): array
    {
        return [
            'add'       => [9,  3,  Operators::Add,       12],
            'multiply'  => [3,  76, Operators::Multiply,  228],
            'divide'    => [9,  3,  Operators::Divide,    3],
            'substract' => [9,  3,  Operators::Substract, 6],
        ];
    }

    public function testCalculatorShouldFailWhenOperatorNotSupported(): void
    {
        $this->expectException(Exception::class);
        (new Calculator())->calculate(9, 3, "UnsupportedOperator");
    }
}
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

```php
class TimeUtility {
    public static function timeOfDay($clock) {
        $hour = intval($clock->time()->format("H"));
        // ...
    }
}
```

- Le test le plus simple que l'on puisse écrire

```php
public function testShouldBeAfternoon(): void
{
    $this->assertSame("Afternoon", TimeUtility::timeOfDay(new Clock()));
}
```

- Ce test n'est pas répétable : le résultat dépend de l'heure système au moment de l'exécution
  - Le design est couplé à `new DateTime()` à l'intérieur de `Clock`
  - Il faut pouvoir substituer la source de temps

- Exemples à couvrir

```text
06:00 -> Morning
02:00 -> Night
13:00 -> Afternoon
23:00 -> Evening
```

### Utiliser un stub de Clock

- `TimeUtility::timeOfDay($clock)` accepte déjà un `$clock` en paramètre
  - C'est une bonne base pour l'injection de dépendance
- On crée un stub avec `createStub(Clock::class)` et on contrôle ce que retourne `time()`

```php
class TimeUtilityTests extends TestCase
{
    protected $clockStub;

    protected function setUp(): void
    {
        $this->clockStub = $this->createStub(Clock::class);
    }

    public function test6AMShouldBeMorning(): void
    {
        $this->clockStub
             ->method('time')
             ->willReturn(new DateTime('2011-01-01T06:00:00Z'));

        $this->assertSame("Morning", TimeUtility::timeOfDay($this->clockStub));
    }

    public function test1PMShouldBeAfternoon(): void
    {
        $this->clockStub
             ->method('time')
             ->willReturn(new DateTime('2011-01-01T13:00:00Z'));

        $this->assertSame("Afternoon", TimeUtility::timeOfDay($this->clockStub));
    }

    public function test2AMShouldBeNight(): void
    {
        $this->clockStub
             ->method('time')
             ->willReturn(new DateTime('2011-01-01T02:00:00Z'));

        $this->assertSame("Night", TimeUtility::timeOfDay($this->clockStub));
    }

    public function test11PMShouldBeEvening(): void
    {
        $this->clockStub
             ->method('time')
             ->willReturn(new DateTime('2011-01-01T23:00:00Z'));

        $this->assertSame("Evening", TimeUtility::timeOfDay($this->clockStub));
    }
}
```

```text
✅ 06:00 -> Morning
✅ 02:00 -> Night
✅ 13:00 -> Afternoon
✅ 23:00 -> Evening
```

> Ne jamais faire confiance à un test qu'on n'a pas vu échouer.
