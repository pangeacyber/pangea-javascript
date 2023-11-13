import { PasswordPolicy, PasswordPolicyChecks } from "./types";

const hasNumber = (number: string): boolean => new RegExp(/[0-9]/).test(number);

// has mix of small and capitals
const hasMixed = (number: string): boolean =>
  new RegExp(/[a-z]/).test(number) && new RegExp(/[A-Z]/).test(number);

const hasUpper = (number: string): boolean => new RegExp(/[A-Z]/).test(number);

const hasLower = (number: string): boolean => new RegExp(/[a-z]/).test(number);

// has special chars
const hasSpecial = (number: string): boolean =>
  new RegExp(/[!#@$%^&*)(+=._-]/).test(number);

export const validatePassword = (
  value: string,
  policy: PasswordPolicy | undefined = undefined
): PasswordPolicyChecks => {
  const minLength = policy?.chars_min ?? 8;
  const checkList: PasswordPolicyChecks = {};

  if (value.length < minLength) {
    checkList["chars"] = 1;
  }

  // FIXME: Just boolean checking has lower/upper/etc.. works currently
  // but should check mins

  if (!!(policy?.upper_min ?? 1) && !hasUpper(value)) {
    checkList["upper"] = 1;
  }
  if (!!(policy?.lower_min ?? 1) && !hasLower(value)) {
    checkList["lower"] = 1;
  }
  if (!!(policy?.number_min ?? 1) && !hasNumber(value)) {
    checkList["number"] = 1;
  }
  if (!!(policy?.punct_min ?? 1) && !hasSpecial(value)) {
    checkList["punct"] = 1;
  }

  return checkList;
};
