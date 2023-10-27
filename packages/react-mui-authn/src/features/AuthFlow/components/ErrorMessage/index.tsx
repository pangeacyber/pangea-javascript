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
  const errorContent =
    response.status === "ValidationError" &&
    response.result?.errors?.length > 0 ? (
      <>
        {response.result.errors.map((err: errorEntry, idx: number) => {
          return (
            <Typography variant="body2" color="error" key={`error-${idx}`}>
              {err.detail}
            </Typography>
          );
        })}
      </>
    ) : response.result?.error ? (
      <Typography variant="body2" color="error">
        {response.result.error}
      </Typography>
    ) : (
      <Typography variant="body2" color="error">
        {response.summary}
      </Typography>
    );
  return <Stack textAlign="center">{errorContent}</Stack>;
};

export default ErrorMessage;
