import { FC } from "react";
import { Stack, Typography } from "@mui/material";

import { APIResponse } from "@pangeacyber/react-auth";

interface Props {
  response: APIResponse;
}

type errorEntry = {
  code: string;
  detail: string;
  source: string;
};

const ErrorMessage: FC<Props> = ({ response }) => {
  if (
    response.status === "ValidationError" &&
    response.result?.errors?.length > 0
  ) {
    return (
      <Stack mt={2} className="flow-errors">
        <Typography variant="caption" color="error">
          {response.result.errors.map((err: errorEntry, idx: number) => {
            return <div key={`error-${idx}`}>{err.detail}</div>;
          })}
        </Typography>
      </Stack>
    );
  }
  return <div>{response.summary}</div>;
};

export default ErrorMessage;
