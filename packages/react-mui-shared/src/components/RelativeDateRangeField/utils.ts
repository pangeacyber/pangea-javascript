import get from "lodash/get";
import startCase from "lodash/startCase";
import { RelativeRange, TimeRangeString, RelativeRangeObject } from "./types";

export enum ShortRelativeRange {
  Year = "y",
  Month = "M",
  Week = "w",
  Day = "d",
  Hour = "h",
  Minute = "m",
  Second = "s",
}

const SHORT_RANGE_TO_FULL = {
  [ShortRelativeRange.Year]: RelativeRange.Year,
  [ShortRelativeRange.Month]: RelativeRange.Month,
  [ShortRelativeRange.Week]: RelativeRange.Week,
  [ShortRelativeRange.Day]: RelativeRange.Day,
  [ShortRelativeRange.Hour]: RelativeRange.Hour,
  [ShortRelativeRange.Minute]: RelativeRange.Minute,
  [ShortRelativeRange.Second]: RelativeRange.Second,
};

const RANGE_TO_SECONDS = {
  [RelativeRange.Year]: 3.154e7,
  [RelativeRange.Month]: 2.628e6,
  [RelativeRange.Week]: 604800,
  [RelativeRange.Day]: 86400,
  [RelativeRange.Hour]: 3600,
  [RelativeRange.Minute]: 60,
  [RelativeRange.Second]: 1,
};

export const RANGE_TO_DISPLAY = {
  [RelativeRange.Year]: "year",
  [RelativeRange.Month]: "month",
  [RelativeRange.Week]: "week",
  [RelativeRange.Day]: "day",
  [RelativeRange.Hour]: "hour",
  [RelativeRange.Minute]: "minute",
  [RelativeRange.Second]: "second",
};

export const getRelativeDateRange = (
  range: TimeRangeString
): RelativeRangeObject => {
  if (!range)
    return {
      amount: 0,
      span: RelativeRange.Day,
      relativeRange: RelativeRange.Day,
      prefix: "",
    };
  const prefix = range.startsWith("t") ? "t" : "";
  const range_ = !!prefix ? range.substring(1) : range;

  const spanMatch = range_.match(/[A-Za-z]*$/g)?.filter((m) => !!m);

  if (
    spanMatch?.length !== 1 ||
    (!Object.values(RelativeRange).includes(spanMatch[0] as RelativeRange) &&
      !Object.values(ShortRelativeRange).includes(
        spanMatch[0] as ShortRelativeRange
      ))
  ) {
    return {
      prefix: "",
      amount: 0,
      span: RelativeRange.Day,
      relativeRange: RelativeRange.Day,
    };
  }

  let span = spanMatch[0];
  if (Object.values(ShortRelativeRange).includes(span as ShortRelativeRange)) {
    // @ts-ignore
    span = SHORT_RANGE_TO_FULL[span];
  }

  // @ts-ignore
  let relativeRange: RelativeRange = span;
  if (!!prefix && relativeRange === RelativeRange.Month) {
    relativeRange = RelativeRange.Minute;
  }

  const amountMatch = range_.match(/[0-9]*/g)?.filter((m) => !!m);
  if (amountMatch?.length !== 1 || isNaN(Number(amountMatch[0]))) {
    return { amount: 0, span: relativeRange, relativeRange, prefix };
  }

  return {
    amount: Number(amountMatch[0]),
    span: span,
    relativeRange,
    prefix,
  };
};

export const getHalfRelativeDateRange = (
  range: string
): RelativeRangeObject => {
  const parsed = getRelativeDateRange(range);

  if (parsed.amount === 0) return parsed;

  let newAmount = parsed.amount / 2;
  let newRelativeRange = parsed.relativeRange;

  // If the new amount is less than 1, move to the next lowest unit
  while (newAmount < 1) {
    const keys = Object.keys(RANGE_TO_SECONDS) as RelativeRange[];
    const currentIndex = keys.indexOf(newRelativeRange);

    if (currentIndex === keys.length - 1) break; // Stop at the smallest unit

    newRelativeRange = keys[currentIndex + 1]; // Move to the next smallest unit
    newAmount *=
      RANGE_TO_SECONDS[keys[currentIndex]] / RANGE_TO_SECONDS[newRelativeRange];
  }

  return {
    amount: Math.floor(newAmount),
    span: RANGE_TO_DISPLAY[newRelativeRange],
    relativeRange: newRelativeRange,
    prefix: parsed.prefix,
  };
};

export const compareRelativeDateRanges = (
  aRange: TimeRangeString | undefined,
  bRange: TimeRangeString | undefined
): number => {
  if (!aRange) return 0;
  if (!bRange) return 0;

  const { amount: aAmount, relativeRange: aType } =
    getRelativeDateRange(aRange);
  const { amount: bAmount, relativeRange: bType } =
    getRelativeDateRange(bRange);

  // @ts-ignore
  const aValue = RANGE_TO_SECONDS[aType] * (aAmount ?? 0);
  // @ts-ignore
  const bValue = RANGE_TO_SECONDS[bType] * (bAmount ?? 0);

  if (aValue < bValue) return -1;
  if (aValue > bValue) return 1;
  return 0;
};

export const getDisplayDateRange = (range: TimeRangeString): string => {
  const { amount, span, relativeRange } = getRelativeDateRange(range);

  const spanDisplay = get(RANGE_TO_DISPLAY, relativeRange, startCase(span));
  const plural =
    !spanDisplay.endsWith("s") && typeof amount === "number" && amount > 1
      ? "s"
      : "";
  return `${amount} ${spanDisplay}${plural}`;
};

export const getRelativeDate = (
  range: TimeRangeString,
  future: boolean = false,
  startDate: Date | undefined = undefined
) => {
  const { relativeRange, amount } = getRelativeDateRange(range);
  const date = startDate ?? new Date();
  if (!amount) return date;

  if (relativeRange === RelativeRange.Year) {
    if (future) {
      date.setDate(date.getDate() + Number(amount) * 365);
    } else {
      date.setDate(date.getDate() - Number(amount) * 365);
    }
  } else if (relativeRange === RelativeRange.Month) {
    if (future) {
      date.setDate(date.getDate() + Number(amount) * 30);
    } else {
      date.setDate(date.getDate() - Number(amount) * 30);
    }
  } else if (relativeRange === RelativeRange.Week) {
    if (future) {
      date.setDate(date.getDate() + Number(amount) * 7);
    } else {
      date.setDate(date.getDate() - Number(amount) * 7);
    }
  } else if (relativeRange === RelativeRange.Day) {
    if (future) {
      date.setDate(date.getDate() + Number(amount));
    } else {
      date.setDate(date.getDate() - Number(amount));
    }
  } else if (relativeRange === RelativeRange.Hour) {
    if (future) {
      date.setHours(date.getHours() + Number(amount));
    } else {
      date.setHours(date.getHours() - Number(amount));
    }
  } else if (relativeRange === RelativeRange.Minute) {
    if (future) {
      date.setMinutes(date.getMinutes() + Number(amount));
    } else {
      date.setMinutes(date.getMinutes() - Number(amount));
    }
  }

  return date;
};
