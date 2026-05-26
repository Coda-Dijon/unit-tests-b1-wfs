<?php

class TimeUtility {

  public static function timeOfDay($clock) {

    $hour = intval($clock->time()->format("H"));

    if($hour >= 0 && $hour < 6) {
      return "Night";
    }

    if($hour >= 6 && $hour < 12) {
      return "Morning";
    }

    if($hour >= 12 && $hour < 18) {
      return "Afternoon";
    }

    return "Evening";

  }
 
}

abstract class Clock {
  public function time() {
    return new DateTime();
  }
}

?>