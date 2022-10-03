export const getISO = (date: any): string => {
  if (typeof date?.toISOString === "function") {
    return date.toISOString();
  }

  if (typeof date === "string") {
    const dateObj = new Date(date);
    if (dateObj.toString() !== "Invalid Date") {
      return dateObj.toISOString();
    }
  }

  return "";
};
