import { FC } from "react";

import { AuthFlow } from "@pangeacyber/vanilla-js";

import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import AuthFlowLayout from "../Layout";
import IdField from "@src/components/fields/IdField";
import Button from "@src/components/core/Button";
import { BodyText } from "@src/components/core/Text";

const getProviderName = (provider: string) => {
  switch (provider) {
    case "google":
      return "Google";
    case "github":
      return "GitHub";
    case "microsoftonline":
      return "Microsoft";
    case "facebook":
      return "Facebook";
    case "password":
      return "a password";
    default:
      return provider;
  }
};

const InvalidAuthView: FC<AuthFlowComponentProps> = ({
  options,
  error,
  update,
  reset,
}) => {
  const providerLabel = getProviderName(error.result?.correct_provider);
  const emailAddress = error.result?.email || "";

  const doUpdate = () => {
    update(AuthFlow.Choice.NONE, {});
  };

  return (
    <AuthFlowLayout>
      <IdField
        value={emailAddress}
        resetCallback={reset}
        resetLabel={options.cancelLabel}
      />
      <BodyText>To log in you must authenticate with {providerLabel}.</BodyText>
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
    </AuthFlowLayout>
  );
};

export default InvalidAuthView;
