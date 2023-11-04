import { FC } from "react";
import { Stack } from "@mui/material";

import { AuthFlow } from "@pangeacyber/vanilla-js";

import Button from "@src/components/core/Button";
import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import AuthFlowLayout from "../Layout";
import IdField from "@src/components/fields/IdField";
import { BodyText } from "@src/components/core/Text";

const MismatchEmailView: FC<AuthFlowComponentProps> = ({
  options,
  data,
  error,
  update,
  reset,
}) => {
  const doUpdate = () => {
    update(AuthFlow.Choice.NONE, {});
  };

  return (
    <AuthFlowLayout>
      <Stack alignItems="center" gap={2}>
        <IdField
          value={error.result?.incorrect_email}
          resetCallback={reset}
          resetLabel={options.cancelLabel}
        />
        <BodyText>
          The social provider email doesn't match your account email.
        </BodyText>
        <Button
          color="primary"
          variant="contained"
          onClick={doUpdate}
          fullWidth
        >
          Select a different method
        </Button>
      </Stack>
    </AuthFlowLayout>
  );
};

export default MismatchEmailView;
