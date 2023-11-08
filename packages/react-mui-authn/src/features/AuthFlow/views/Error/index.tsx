import { FC } from "react";

import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import AuthFlowLayout from "../Layout";
import IdField from "@src/components/fields/IdField";
import Button from "@src/components/core/Button";
import { ErrorMessage } from "../../components";
import { BodyText } from "@src/components/core/Text";

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
  const buttons = !data.email ? (
    <Button fullWidth color="secondary" onClick={reset}>
      {options.cancelLabel}
    </Button>
  ) : undefined;

  return (
    <AuthFlowLayout title={getErrorTitle(error.status)} buttons={buttons}>
      <IdField
        value={data?.email}
        resetCallback={reset}
        resetLabel={options.cancelLabel}
      />
      {error ? (
        <ErrorMessage response={error} />
      ) : (
        <BodyText>
          {error && error.summary
            ? error.summary
            : "An error occurred, please try again later."}
        </BodyText>
      )}
    </AuthFlowLayout>
  );
};

export default ErrorView;
