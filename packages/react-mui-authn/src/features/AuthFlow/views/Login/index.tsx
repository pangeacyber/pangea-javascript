import { FC } from "react";

import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import AuthFlowLayout from "../Layout";
import { AuthOptions, SocialOptions } from "../../components";
import IdField from "@src/components/fields/IdField";
import { BodyText } from "@src/components/core/Text";
import RememberDevice from "../../components/RememberDevice";

const LoginView: FC<AuthFlowComponentProps> = (props) => {
  const { options, data, reset } = props;
  const disclaimer =
    data.disclaimer && data.phase !== "phase_one_time" ? data.disclaimer : "";

  // TODO: Add branding option for onetime title
  const title = data.phase === "phase_one_time" ? "" : options.passwordHeading;

  return (
    <AuthFlowLayout title={title} disclaimer={disclaimer}>
      {data.phase !== "phase_one_time" && (
        <IdField
          value={data?.username || data?.email}
          resetCallback={reset}
          resetLabel={options.cancelLabel}
        />
      )}
      <AuthOptions {...props} />
      {data.authChoices.length === 0 &&
        data.socialChoices.length === 0 &&
        data.samlChoices.length === 0 && (
          <BodyText color="error" sxProps={{ padding: "0 16px" }}>
            There are no valid authentication methods available
          </BodyText>
        )}
      <SocialOptions {...props} />
      {!!data.conditionalMfa && data.phase === "phase_secondary" && (
        <RememberDevice {...props} />
      )}
    </AuthFlowLayout>
  );
};

export default LoginView;
