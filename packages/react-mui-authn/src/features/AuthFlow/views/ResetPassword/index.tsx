import { FC } from "react";

import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import AuthFlowLayout from "../Layout";
import IdField from "@src/components/fields/IdField";
import { AuthPassword } from "../../components";

const ResetPasswordView: FC<AuthFlowComponentProps> = (props) => {
  const { options, data, reset } = props;

  return (
    <AuthFlowLayout title="Reset Password">
      <IdField
        value={data.email}
        resetCallback={reset}
        resetLabel={options.cancelLabel}
      />
      <AuthPassword {...props} />
    </AuthFlowLayout>
  );
};

export default ResetPasswordView;
