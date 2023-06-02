import { FC } from "react";
import get from "lodash/get";

import { Box, Stack, Typography } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

import { validatePassword } from "@src/utils";
import { PasswordPolicy } from "@src/types";

interface StyleProps {
  backgroundColor?: string;
}

const StackStyle = styled(Stack)<StyleProps>(({ backgroundColor }) => ({
  padding: "12px",
  backgroundColor: backgroundColor,
  borderRadius: "8px",
  boxShadow: "0px 4px 16px -5px rgba(0, 0, 0, 0.2)",

  "&::after": {
    border: "solid transparent",
    content: `""`,
    height: 0,
    width: 0,
    position: "absolute",
    pointerEvents: "none",
    borderWidth: "8px",
  },

  "&.right::after": {
    top: "50%",
    right: "100%",
    marginTop: "-8px",
    borderRightColor: backgroundColor,
  },

  "&.top::after": {
    top: "100%",
    right: "50%",
    marginLeft: "-8px",
    borderTopColor: backgroundColor,
  },
}));

interface Props {
  value: string;
  policy?: PasswordPolicy;
  positionTop?: boolean;
}

const PasswordRequirements: FC<Props> = ({
  value,
  policy,
  positionTop = false,
}) => {
  const theme = useTheme();
  const position = positionTop ? "top" : "right";
  const passwordErrors = validatePassword(value);
  const passwordChecks = [
    { key: "upper", label: "Uppercase" },
    { key: "lower", label: "Lowercase" },
    { key: "number", label: "Number" },
    { key: "punct", label: "Special character" },
    {
      key: "chars",
      label: `At least ${policy?.password_chars_min ?? 8} characters`,
    },
  ];

  return (
    <StackStyle
      backgroundColor={theme.palette.background.paper}
      className={position}
    >
      <Typography
        variant="caption"
        sx={{ fontWeight: "500", paddingBottom: "4px" }}
      >
        Password Requirements
      </Typography>
      <Typography variant="caption" component="div">
        {passwordChecks
          .filter((item) => {
            return !!get(policy ?? {}, `password_${item.key}_min`, 1);
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

export default PasswordRequirements;
