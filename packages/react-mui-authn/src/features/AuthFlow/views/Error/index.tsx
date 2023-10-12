import { FC, useEffect, useState } from "react";
import { Stack, Typography } from "@mui/material";

import { AuthFlow } from "@pangeacyber/vanilla-js";

import Button from "@src/components/core/Button";
import { ErrorMessage } from "../../components";
import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";

const ErrorView: FC<AuthFlowComponentProps> = ({
  options,
  error,
  update,
  reset,
}) => {
  const [retried, setRetried] = useState<boolean>(false);

  useEffect(() => {
    if (!retried) {
      setRetried(true);
      update(AuthFlow.Choice.NONE, {});
    }
  }, []);

  return (
    <Stack gap={2}>
      <Typography variant="h6">Something went wrong</Typography>
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
