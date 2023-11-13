export interface PasswordPolicy {
  chars_min?: number;
  chars_max?: number;
  lower_min?: number;
  upper_min?: number;
  punct_min?: number;
  number_min?: number;
}

export interface PasswordPolicyChecks {
  chars?: number;
  upper?: number;
  lower?: number;
  number?: number;
  punct?: number;
}
