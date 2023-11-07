import { FC } from "react";

import { AuthFlow } from "@pangeacyber/vanilla-js";

import {
  AuthFlowComponentProps,
  AuthFlowViewOptions,
} from "@src/features/AuthFlow/types";
import AuthFlowLayout from "../Layout";
import { AuthOptions, SocialOptions } from "../../components";
import IdField from "@src/components/fields/IdField";
import { ErrorText } from "@src/components/core/Text";

const getDisplayData = (
  data: AuthFlow.StateData,
  options: AuthFlowViewOptions
): string => {
  if (data.phase === "phase_secondary") {
    return "Confirm your identity";
  }

  return options.signupHeading || "Create your account";
};

const SignupView: FC<AuthFlowComponentProps> = (props) => {
  const { options, data, reset } = props;
  const title = getDisplayData(data, options);
  const disclaimer =
    data.disclaimer && data.phase !== "phase_secondary" ? data.disclaimer : "";

  return (
    <AuthFlowLayout title={title} disclaimer={disclaimer}>
      <IdField
        value={data.email}
        resetCallback={reset}
        resetLabel={options.cancelLabel}
      />
      <AuthOptions {...props} />
      {data.authChoices.length === 0 && data.socialChoices.length === 0 && (
        <ErrorText>
          There are no valid authentication methods available
        </ErrorText>
      )}
      {(data.invite ||
        data.phase === "phase_secondary" ||
        data.samlChoices.length > 0) && <SocialOptions {...props} />}
    </AuthFlowLayout>
  );
};

export default SignupView;
