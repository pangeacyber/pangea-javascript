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
