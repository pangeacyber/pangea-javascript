import { FC } from "react";
import { Stack } from "@mui/material";

import { AuthFlow } from "@pangeacyber/vanilla-js";

import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import AuthFlowLayout from "../Layout";
import IdField from "@src/components/fields/IdField";
import Button from "@src/components/core/Button";
import { BodyText } from "@src/components/core/Text";
import { getProviderLabel } from "@src/features/AuthFlow/utils";

const InvalidAuthView: FC<AuthFlowComponentProps> = ({
  options,
  error,
  update,
  reset,
}) => {
  const providerLabel = getProviderLabel(error.result?.correct_provider);
  const emailAddress = error.result?.email || "";

  const doUpdate = () => {
    update(AuthFlow.Choice.NONE, {});
  };

  return (
    <AuthFlowLayout>
      <Stack alignItems="center" gap={2}>
        <IdField
          value={emailAddress}
          resetCallback={reset}
          resetLabel={options.cancelLabel}
        />
        <BodyText>
          Incorrect authentication method. To log in you must use{" "}
          {providerLabel}.
        </BodyText>
        {error.result?.correct_provider && (
          <Button
            color="primary"
            variant="contained"
            onClick={doUpdate}
            fullWidth
          >
            Continue with {providerLabel}
          </Button>
        )}
      </Stack>
    </AuthFlowLayout>
  );
};

export default InvalidAuthView;
