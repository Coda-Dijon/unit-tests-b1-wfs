import type { Clock } from "./Clock";

export class TimeUtility {
  constructor(private readonly clock: Clock) {}

  getTimeOfDay(): string {
    const hour = this.clock.now().getHours();

    if (hour < 6) return "Night";
    if (hour < 12) return "Morning";
    if (hour < 18) return "Afternoon";
    return "Evening";
  }
}
