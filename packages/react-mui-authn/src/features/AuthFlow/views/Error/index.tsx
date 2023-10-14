import { FC } from "react";
import { Stack, Typography } from "@mui/material";

import Button from "@src/components/core/Button";
import { ErrorMessage } from "../../components";
import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";

const getErrorTitle = (status: string): string => {
  switch (status) {
    case "DisabledUser":
      return "Account Disabled";
    default:
      return "Something went wrong";
  }
};

const ErrorView: FC<AuthFlowComponentProps> = ({
  options,
  error,
  data,
  reset,
}) => {
  return (
    <Stack gap={2}>
      <Typography variant="h6">{getErrorTitle(error.status)}</Typography>
      {data?.email && (
        <Typography variant="body2" mb={1} sx={{ wordBreak: "break-word" }}>
          {data.email}
        </Typography>
      )}
      <Stack gap={1}>
        {error ? (
          <ErrorMessage response={error} />
        ) : (
          <Typography variant="body2">
            {error && error.summary
              ? error.summary
              : "An error occurred, please try again later."}
          </Typography>
        )}
      </Stack>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="center"
        gap={{ xs: 0, sm: 1 }}
      >
        <Button variant="text" onClick={reset}>
          {options.cancelLabel}
        </Button>
      </Stack>
    </Stack>
  );
};

export default ErrorView;
