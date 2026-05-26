<?php

use PHPUnit\Framework\TestCase;

require_once __DIR__ . "../../src/TimeUtility.php";

class TimeUtilityTests extends TestCase {

    protected $clockStub;

    protected function setUp() : void
    {
        $this->clockStub = $this->createStub(Clock::class);
    }

    public function test6AMShouldBeMorning()
    {
        $this->clockStub
             ->method('time')
             ->willReturn(new DateTime('2011-01-01T06:00:00.012345Z'));

        $this->assertSame("Morning", TimeUtility::timeOfDay($this->clockStub));
    }

    public function test1PMShouldBeAfternoon()
    {
        $this->clockStub
            ->method('time')
            ->willReturn(new DateTime('2011-01-01T13:00:00.012345Z'));

        $this->assertSame("Afternoon", TimeUtility::timeOfDay($this->clockStub));
    }

    public function test2AMShouldBeNight()
    {
        $this->clockStub
            ->method('time')
            ->willReturn(new DateTime('2011-01-01T02:00:00.012345Z'));

        $this->assertSame("Night", TimeUtility::timeOfDay($this->clockStub));
    }

    public function test11PMShouldBeEvening()
    {
        $this->clockStub
            ->method('time')
            ->willReturn(new DateTime('2011-01-01T23:00:00.012345Z'));

        $this->assertSame("Evening", TimeUtility::timeOfDay($this->clockStub));
    }

}

?>