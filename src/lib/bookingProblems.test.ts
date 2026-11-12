import { describe, expect, it } from "vitest";
import { RangeProblemEnum } from "@/lib/availability";
import { BookingFailureEnum, bookingProblemMessage } from "@/lib/bookingProblems";

describe("bookingProblemMessage", () => {
  it("covers range problems and booking failures", () => {
    expect(bookingProblemMessage(RangeProblemEnum.OverlapsBooking)).toMatch(/overlap/);
    expect(bookingProblemMessage(BookingFailureEnum.TooManyGuests)).toMatch(/guests/);
  });
});
