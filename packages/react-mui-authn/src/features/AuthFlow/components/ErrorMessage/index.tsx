import { FC } from "react";
import { Stack } from "@mui/material";

import { APIResponse } from "@pangeacyber/vanilla-js";
import { ErrorText } from "@src/components/core/Text";

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
          return <ErrorText key={`error-${idx}`}>{err.detail}</ErrorText>;
        })}
      </>
    ) : response.result?.error ? (
      <ErrorText>{response.result.error}</ErrorText>
    ) : (
      <ErrorText>{response.summary}</ErrorText>
    );
  return <Stack textAlign="center">{errorContent}</Stack>;
};

export default ErrorMessage;
