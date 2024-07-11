import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  formatISO,
} from "date-fns";

export function determineDateRange(filter) {
  const now = new Date();
  let startDate, endDate;

  switch (filter) {
    case "day":
      startDate = startOfDay(now);
      endDate = endOfDay(now);
      break;
    case "week":
      startDate = startOfWeek(now, { weekStartsOn: 1 });
      endDate = endOfWeek(now, { weekStartsOn: 1 });
      break;
    case "month":
      startDate = startOfMonth(now);
      endDate = endOfMonth(now);
      break;
    case "year":
      startDate = startOfYear(now);
      endDate = endOfYear(now);
      break;
    case "all":
      startDate = null;
      endDate = null;
      break;
    default:
      throw new Error("Invalid filter option");
  }

  // Dates to ISO strings, or keep them null for the "all" filter
  const formattedStartDate = startDate ? formatISO(startDate) : null;
  const formattedEndDate = endDate ? formatISO(endDate) : null;

  return [formattedStartDate, formattedEndDate];
}
