import { describe, expect, it, vi } from "vitest";
import { TimeUtility } from "../src/TimeUtility";
import type { Clock } from "../src/Clock";

function clockAt(hour: number): Clock {
  return { now: vi.fn().mockReturnValue(new Date(2011, 0, 1, hour, 0, 0)) };
}

describe("TimeUtility", () => {
  it.each([
    [0, "Night"],
    [4, "Night"],
    [6, "Morning"],
    [9, "Morning"],
    [12, "Afternoon"],
    [17, "Afternoon"],
    [18, "Evening"],
    [23, "Evening"],
  ])("hour %i should return %s", (hour, expected) => {
    const timeUtility = new TimeUtility(clockAt(hour));
    expect(timeUtility.getTimeOfDay()).toBe(expected);
  });
});
