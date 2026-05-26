# Test it or Die Trying (35')

- Le `composer.json` contient déjà tout le nécessaire pour écrire et lancer des tests
```json
{
  "require-dev": {
    "phpunit/phpunit": "^9.5"
  }
}
```
- Lancer les tests depuis le dossier `php/` :
```bash
composer install
vendor/bin/phpunit tests/
```
- Documentation de `PHPUnit` disponible [ici](https://docs.phpunit.de/en/9.6/)

## Calculator

- Écris quelques tests sur la classe `Calculator`
  - Quels sont les cas limites (*edge cases*) ?
  - Écris des tests pour eux aussi

```php
abstract class Operators
{
    const ADD      = "add";
    const MULTIPLY = "multiply";
    const DIVIDE   = "divide";
    const SUBSTRACT = "substract";
}

class Calculator
{
    public function calculate($a, $b, $operator)
    {
        if (!array_key_exists($operator, $this->supportedOperators)) {
            throw new Exception("Unsupported operator {$operator}");
        }
        return $this->supportedOperators[$operator]($a, $b);
    }
}
```

> You are not allowed to change production code

Step-by-step solution is available [here](../solutions/php/step-by-step.md)

## TimeUtility

- Écris au moins un test pour la méthode `TimeUtility::timeOfDay()`
  - Quel problème rencontres-tu ?

```php
class TimeUtility {
    public static function timeOfDay($clock) {
        $hour = intval($clock->time()->format("H"));

        if ($hour >= 0 && $hour < 6)  return "Night";
        if ($hour >= 6 && $hour < 12) return "Morning";
        if ($hour >= 12 && $hour < 18) return "Afternoon";
        return "Evening";
    }
}

abstract class Clock {
    public function time() {
        return new DateTime();
    }
}
```

- Pour les *Test Doubles*, PHPUnit fournit `createStub()` nativement — aucune dépendance supplémentaire n'est nécessaire
  - Documentation disponible [ici](https://docs.phpunit.de/en/9.6/test-doubles.html)

```php
$clockStub = $this->createStub(Clock::class);
$clockStub->method('time')->willReturn(new DateTime('2011-01-01T06:00:00Z'));
```

> Never trust a test that you have not seen failed

Step-by-step solution is available [here](../solutions/php/step-by-step.md)
