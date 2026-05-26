export class TimeUtility {
  getTimeOfDay(): string {
    const hour = new Date().getHours();

    if (hour < 6) return "Night";
    if (hour < 12) return "Morning";
    if (hour < 18) return "Afternoon";
    return "Evening";
  }
}
