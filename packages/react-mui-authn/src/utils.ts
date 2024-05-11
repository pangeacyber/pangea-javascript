import { PasswordPolicy } from "./types";

// has number
const hasNumber = (number: string): boolean => new RegExp(/[0-9]/).test(number);

const hasUpper = (number: string): boolean => new RegExp(/[A-Z]/).test(number);

const hasLower = (number: string): boolean => new RegExp(/[a-z]/).test(number);

// has special chars
const hasSpecial = (number: string): boolean =>
  new RegExp(/[!#@$%^&*)(+=._-]/).test(number);

interface IDict {
  [index: string]: number;
}

export const validatePassword = (
  value: string,
  policy: PasswordPolicy | undefined = undefined
): object => {
  const minLength = policy?.chars_min ?? policy?.password_chars_min ?? 8;
  const checkList = {} as IDict;

  if (value.length < minLength) {
    checkList["chars"] = 1;
  }

  if (
    (policy?.upper_min ?? policy?.password_upper_min ?? 1) &&
    !hasUpper(value)
  ) {
    checkList["upper"] = 1;
  }
  if (
    (policy?.lower_min ?? policy?.password_lower_min ?? 1) &&
    !hasLower(value)
  ) {
    checkList["lower"] = 1;
  }
  if (
    (policy?.number_min ?? policy?.password_number_min ?? 1) &&
    !hasNumber(value)
  ) {
    checkList["number"] = 1;
  }
  if (
    (policy?.punct_min ?? policy?.password_punct_min ?? 1) &&
    !hasSpecial(value)
  ) {
    checkList["punct"] = 1;
  }

  return checkList;
};

export const hex2rgba = (hex: string, alpha = 1) => {
  // @ts-ignore next-line
  const [r, g, b] = hex.match(/[0-9A-Fa-f]{2}/g).map((x) => parseInt(x, 16));
  return `rgba(${r},${g},${b},${alpha})`;
};

export const isJSON = (content: string): boolean => {
  try {
    JSON.parse(content);
    return true;
  } catch {
    return false;
  }
};

export const formatDateString = (
  dateString: string,
  year: "numeric" | null = "numeric",
  day: "numeric" | null = "numeric"
): string => {
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat("en", {
      month: "short",
      day: !day ? undefined : day,
      year: !year ? undefined : year,
    }).format(d);
  } catch (e) {
    return "";
  }
};

export const PHONE_REGEXP =
  /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|(1|[0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;

// remove non-digits and prepend +1 if missing
export const cleanPhoneNumber = (value: string): string => {
  const numbers = value.replace(/\D/g, "");
  return numbers.startsWith("+1") ? numbers : `+1${numbers}`;
};

export const validatePhoneNumber = (value: string): boolean => {
  const cleaned = cleanPhoneNumber(value);
  return PHONE_REGEXP.test(cleaned);
};

export const USERNAME_REGEXP = /^[0-9a-zA-Z+._+@-]{2,320}$/;

export const validateUsername = (username: string): boolean => {
  return USERNAME_REGEXP.test(username);
};
