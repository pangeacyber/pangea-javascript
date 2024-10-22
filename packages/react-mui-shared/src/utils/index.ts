export const getISO = (date: any): string => {
  try {
    if (typeof date?.toISOString === "function") {
      return date.toISOString();
    }

    if (typeof date === "string") {
      const dateObj = new Date(date);
      if (dateObj.toString() !== "Invalid Date") {
        return dateObj.toISOString();
      }
    }
  } catch {}

  return "";
};

export const limitCharacters = (value: string, limit: number) => {
  if (typeof value !== "string") return value;
  let value_ = value.substring(0, limit);

  if (value.length > limit) {
    value_ = value_ + "...";
  }

  return value_;
};

export const getTransformValue = (
  transform: string
): { x: number; y: number } => {
  const regex = /-?[0-9]*px/g;
  const match = transform.match(regex);
  if (match && match.length === 2) {
    const y = Number(match[0].split("px")[0]);
    const x = Number(match[1].split("px")[0]);

    return { y, x };
  }
  return { x: 0, y: 0 };
};

export const reorder = (
  list: any[],
  startIndex: number,
  endIndex: number
): any[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const safeStringify = (o: any) => {
  return JSON.stringify(o, (k, value) => {
    return typeof value === "function" ||
      typeof value === "symbol" ||
      (typeof value === "object" && !!value?.$$typeof)
      ? null
      : value;
  });
};
