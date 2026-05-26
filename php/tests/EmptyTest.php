<?php

use PHPUnit\Framework\TestCase;

class EmptyTest extends TestCase
{
    public function anEmptyTest(): void
    {
        $this->assertSame("42", 43);
    }
}