import { FC } from "react";
import get from "lodash/get";

import { Stack } from "@mui/material";
import { CheckRounded, ErrorRounded } from "@mui/icons-material";

import { validatePassword } from "@src/utils";
import { PasswordPolicy } from "@src/types";
import { BodyText } from "../Text";

interface Props {
  value: string;
  policy?: PasswordPolicy;
}

const PasswordRequirements: FC<Props> = ({ value, policy }) => {
  const passwordErrors = validatePassword(value, policy);
  const passwordChecks = [
    { key: "upper", label: "Uppercase" },
    { key: "lower", label: "Lowercase" },
    { key: "number", label: "Number" },
    { key: "punct", label: "Special character" },
    {
      key: "chars",
      label: `At least ${
        policy?.chars_min ?? policy?.password_chars_min ?? 8
      } characters`,
    },
  ];

  if (!policy) {
    return null;
  }

  return (
    <Stack gap={0.5} mb={2}>
      {passwordChecks
        .filter((item) => {
          return get(policy ?? {}, `${item.key}_min`, undefined);
        })
        .map((item) => {
          const error = item.key in passwordErrors;
          return (
            <Stack key={item.key} direction="row" gap={1} alignItems="center">
              {error ? (
                <ErrorRounded sx={{ fontSize: "20px" }} color="error" />
              ) : (
                <CheckRounded sx={{ fontSize: "20px" }} color="success" />
              )}
              <BodyText>{item.label}</BodyText>
            </Stack>
          );
        })}
    </Stack>
  );
};

export default PasswordRequirements;
