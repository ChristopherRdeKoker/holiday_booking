import { problemMessage, RangeProblemEnum } from "@/lib/availability";

export enum BookingFailureEnum {
  UnknownHome = 101,
  TooManyGuests = 102,
}

const failureMessages: Record<BookingFailureEnum, string> = {
  [BookingFailureEnum.UnknownHome]: "That home no longer exists.",
  [BookingFailureEnum.TooManyGuests]: "That's more guests than this home sleeps.",
};

export function bookingProblemMessage(problem: RangeProblemEnum | BookingFailureEnum): string {
  const isFailure = problem === BookingFailureEnum.UnknownHome || problem === BookingFailureEnum.TooManyGuests;
  const result = isFailure ? failureMessages[problem] : problemMessage(problem);
  return result;
}
