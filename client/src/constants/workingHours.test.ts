import { getScheduleForDay } from "./workingHours";

describe("getScheduleForDay", () => {
  it("getScheduleForDay_ShouldReturnWeekdaySchedule_WhenDayIsMonday", () => {
    const schedule = getScheduleForDay(1);
    expect(schedule).not.toBeNull();
    expect(schedule?.start).toBe("09:00");
    expect(schedule?.end).toBe("18:00");
  });

  it("getScheduleForDay_ShouldReturnWeekdaySchedule_WhenDayIsThursday", () => {
    const schedule = getScheduleForDay(4);
    expect(schedule).not.toBeNull();
    expect(schedule?.start).toBe("09:00");
    expect(schedule?.end).toBe("18:00");
  });

  it("getScheduleForDay_ShouldReturnFridaySchedule_WhenDayIsFriday", () => {
    const schedule = getScheduleForDay(5);
    expect(schedule).not.toBeNull();
    expect(schedule?.start).toBe("09:00");
    expect(schedule?.end).toBe("12:00");
  });

  it("getScheduleForDay_ShouldReturnNull_WhenDayIsSaturday", () => {
    expect(getScheduleForDay(6)).toBeNull();
  });

  it("getScheduleForDay_ShouldReturnNull_WhenDayIsSunday", () => {
    expect(getScheduleForDay(0)).toBeNull();
  });
});
