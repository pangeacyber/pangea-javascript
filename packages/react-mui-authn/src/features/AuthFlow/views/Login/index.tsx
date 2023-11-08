import { FC } from "react";

import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import AuthFlowLayout from "../Layout";
import { AuthOptions, SocialOptions } from "../../components";
import IdField from "@src/components/fields/IdField";
import { BodyText } from "@src/components/core/Text";

const LoginView: FC<AuthFlowComponentProps> = (props) => {
  const { options, data, reset } = props;
  const disclaimer =
    data.disclaimer && data.phase !== "phase_one_time" ? data.disclaimer : "";

  return (
    <AuthFlowLayout title={options.passwordHeading} disclaimer={disclaimer}>
      <IdField
        value={data?.email}
        resetCallback={reset}
        resetLabel={options.cancelLabel}
      />
      <AuthOptions {...props} />
      {data.authChoices.length === 0 &&
        data.socialChoices.length === 0 &&
        data.samlChoices.length === 0 && (
          <BodyText color="error" sxProps={{ padding: "0 16px" }}>
            There are no valid authentication methods available
          </BodyText>
        )}
      <SocialOptions {...props} />
    </AuthFlowLayout>
  );
};

export default LoginView;
