import { FC } from "react";
import get from "lodash/get";

import { Box, Stack, Typography } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { PasswordPolicy } from "./types";
import { validatePassword } from "./utils";

const StackStyle = styled(Stack)(({ theme }) => ({
  padding: "12px",
  backgroundColor: theme.palette.primary.contrastText,
  borderRadius: "8px",
  boxShadow: "0px 4px 16px -5px rgba(0, 0, 0, 0.2)",
  zIndex: "500",

  "&::after": {
    top: "50%",
    right: "100%",
    border: "solid transparent",
    content: `""`,
    height: 0,
    width: 0,
    position: "absolute",
    pointerEvents: "none",
    borderRightColor: theme.palette.primary.contrastText,
    borderWidth: "8px",
    marginTop: "-8px",
  },
}));

interface Props {
  value: string;
  policy?: PasswordPolicy;
}

const PasswordRequirementDisplay: FC<Props> = ({ value, policy }) => {
  const theme = useTheme();
  const passwordErrors = validatePassword(value);
  const passwordChecks = [
    { key: "upper", label: "Uppercase" },
    { key: "lower", label: "Lowercase" },
    { key: "number", label: "Number" },
    { key: "punct", label: "Special character" },
    {
      key: "chars",
      label: `At least ${policy?.chars_min ?? 8} characters`,
    },
  ];

  return (
    <StackStyle>
      <Typography
        variant="caption"
        sx={{ fontWeight: "500", paddingBottom: "4px" }}
      >
        Password Requirements
      </Typography>
      <Typography variant="caption" component="div">
        {passwordChecks
          .filter((item) => {
            return !!get(policy ?? {}, `${item.key}_min`, 1);
          })
          .map((item) => {
            const error = item.key in passwordErrors;
            return (
              <Stack
                key={item.key}
                direction="row"
                sx={{
                  color: error
                    ? theme.palette.error.main
                    : theme.palette.success.main,
                  paddingBottom: "4px",
                }}
              >
                {error ? (
                  <CloseIcon sx={{ height: "16px", width: "16px" }} />
                ) : (
                  <CheckIcon sx={{ height: "16px", width: "16px" }} />
                )}
                <Box sx={{ paddingLeft: "4px" }}>{item.label}</Box>
              </Stack>
            );
          })}
      </Typography>
    </StackStyle>
  );
};

export default PasswordRequirementDisplay;
