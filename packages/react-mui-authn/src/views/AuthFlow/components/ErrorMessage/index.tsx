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
            <Typography variant="caption" color="red" key={`error-${idx}`}>
              {err.detail}
            </Typography>
          );
        })}
      </>
    ) : (
      <Typography variant="caption" color="red">
        {response.summary}
      </Typography>
    );

  return (
    <Stack mt={2} className="flow-errors">
      {errorContent}
    </Stack>
  );
};

export default ErrorMessage;
