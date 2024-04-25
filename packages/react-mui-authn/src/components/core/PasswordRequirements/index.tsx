import { FC } from "react";
import get from "lodash/get";

import { Stack, Typography, useTheme } from "@mui/material";
import { CheckRounded, ErrorRounded } from "@mui/icons-material";

import { validatePassword } from "@src/utils";
import { PasswordPolicy } from "@src/types";
import { BodyText } from "../Text";

interface Props {
  value: string;
  policy?: PasswordPolicy;
}

const PasswordRequirements: FC<Props> = ({ value, policy }) => {
  const theme = useTheme();
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
    <Stack gap={0.5} mb={1}>
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
              <BodyText
                sxProps={{
                  color: error ? "initial" : theme.palette.success.main,
                }}
              >
                {item.label}
              </BodyText>
            </Stack>
          );
        })}
      {"punct_min" in policy && (
        <Stack alignItems="flex-start" direction="row" mt={1} gap={1}>
          <BodyText>Special characters:</BodyText>
          <Typography variant="body2" sx={{ letterSpacing: "0.2rem" }}>
            !@#$%^&*().-=+
          </Typography>
        </Stack>
      )}
    </Stack>
  );
};

export default PasswordRequirements;
