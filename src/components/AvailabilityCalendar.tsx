import { useRef, useState, type KeyboardEvent } from "react";
import { flushSync } from "react-dom";
import { Icon } from "@/components/Icon";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/cn";
import { calendarDayLabel, calendarStatus, describeCalendarDay, selectCalendarDay, type StaySelectionType } from "@/lib/calendarDays";
import { addDays, formatMonth, monthGrid, monthNumberOf, type ISODateType } from "@/lib/dates";

type AvailabilityCalendarProps = {
  today: ISODateType;
  nights: ReadonlySet<ISODateType>;
  selection: StaySelectionType;
  onSelect: (selection: StaySelectionType) => void;
};

const MONTHS_AHEAD = 12;

const weekdays = [
  ["Mon", "Monday"],
  ["Tue", "Tuesday"],
  ["Wed", "Wednesday"],
  ["Thu", "Thursday"],
  ["Fri", "Friday"],
  ["Sat", "Saturday"],
  ["Sun", "Sunday"],
] as const;

const keyJumps: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7, PageUp: -28, PageDown: 28 };

export function AvailabilityCalendar({ today, nights, selection, onSelect }: AvailabilityCalendarProps) {
  const isWide = useMediaQuery("(min-width: 48rem)");
  const monthCount = isWide ? 2 : 1;
  const firstMonth = monthNumberOf(today);
  const lastMonth = firstMonth + MONTHS_AHEAD - 1;

  const [requestedMonth, setRequestedMonth] = useState(() => (selection.checkIn ? monthNumberOf(selection.checkIn) : firstMonth));
  const [focusedDay, setFocusedDay] = useState<ISODateType>(selection.checkIn || today);
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleMonth = Math.min(Math.max(requestedMonth, firstMonth), lastMonth - monthCount + 1);
  const visibleMonths = Array.from({ length: monthCount }, (_, index) => visibleMonth + index);
  const isFocusVisible = monthNumberOf(focusedDay) >= visibleMonth && monthNumberOf(focusedDay) <= visibleMonth + monthCount - 1;
  const tabStop = isFocusVisible ? focusedDay : visibleMonths.flatMap((month) => monthGrid(month).flat()).find((day) => day !== null && day >= today);

  function handleDayClick(day: ISODateType) {
    setFocusedDay(day);
    onSelect(selectCalendarDay(day, today, nights, selection));
  }

  function handleDayKeyDown(event: KeyboardEvent<HTMLButtonElement>, day: ISODateType) {
    if (!(event.key in keyJumps)) return;
    event.preventDefault();

    const target = addDays(day, keyJumps[event.key]);
    const targetMonth = monthNumberOf(target);
    if (targetMonth < firstMonth || targetMonth > lastMonth) return;

    flushSync(() => {
      if (targetMonth < visibleMonth) setRequestedMonth(targetMonth);
      if (targetMonth > visibleMonth + monthCount - 1) setRequestedMonth(targetMonth - monthCount + 1);
      setFocusedDay(target);
    });
    containerRef.current?.querySelector<HTMLButtonElement>(`[data-date="${target}"]`)?.focus();
  }

  return (
    <div className="calendar" ref={containerRef}>
      <div className="calendar-nav">
        <button type="button" className="icon-button" onClick={() => setRequestedMonth(visibleMonth - 1)} disabled={visibleMonth <= firstMonth} aria-label="Previous month">
          <Icon name="chevronLeft" />
        </button>
        <p className="calendar-status" aria-live="polite" data-testid="calendar-status">
          {calendarStatus(selection)}
        </p>
        <button type="button" className="icon-button" onClick={() => setRequestedMonth(visibleMonth + 1)} disabled={visibleMonth + monthCount - 1 >= lastMonth} aria-label="Next month">
          <Icon name="chevronRight" />
        </button>
      </div>
      <div className="calendar-months">
        {visibleMonths.map((month) => (
          <table key={month} className="calendar-month">
            <caption>{formatMonth(month)}</caption>
            <thead>
              <tr>
                {weekdays.map(([shortName, longName]) => (
                  <th key={shortName} scope="col">
                    <abbr title={longName}>{shortName}</abbr>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {monthGrid(month).map((week, weekIndex) => (
                <tr key={weekIndex}>
                  {week.map((day, dayIndex) => {
                    if (day === null) return <td key={dayIndex} />;
                    const dayState = describeCalendarDay(day, today, nights, selection);
                    return (
                      <td key={dayIndex}>
                        <button
                          type="button"
                          className={cn(
                            "day",
                            dayState.isBooked && "is-booked",
                            dayState.isPast && "is-past",
                            !dayState.isSelectable && "is-disabled",
                            dayState.isCheckIn && "is-start",
                            dayState.isCheckOut && "is-end",
                            dayState.isInStay && "is-in-range",
                            day === today && "is-today",
                          )}
                          data-date={day}
                          tabIndex={day === tabStop ? 0 : -1}
                          aria-disabled={!dayState.isSelectable}
                          aria-pressed={dayState.isCheckIn || dayState.isCheckOut}
                          aria-label={calendarDayLabel(day, dayState)}
                          onClick={() => dayState.isSelectable && handleDayClick(day)}
                          onKeyDown={(event) => handleDayKeyDown(event, day)}
                        >
                          {Number(day.slice(8))}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        ))}
      </div>
      <ul className="calendar-legend">
        <li>
          <span className="legend-swatch is-free" aria-hidden="true" />
          Available
        </li>
        <li>
          <span className="legend-swatch is-booked" aria-hidden="true" />
          Booked
        </li>
        <li>
          <span className="legend-swatch is-selected" aria-hidden="true" />
          Your stay
        </li>
      </ul>
    </div>
  );
}
