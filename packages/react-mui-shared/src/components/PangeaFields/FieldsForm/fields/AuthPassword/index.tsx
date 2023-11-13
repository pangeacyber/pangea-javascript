import { Popper } from "@mui/material";
import merge from "lodash/merge";
import { FC, useState } from "react";
import {
  AuthPasswordFieldSchemaProps,
  InputFieldComponentProps,
} from "../../types";
import PasswordRequirementDisplay from "./PasswordRequirementDisplay";
import StringField from "../StringField";

interface AuthPasswordFieldProps
  extends InputFieldComponentProps<AuthPasswordFieldSchemaProps> {}

const AuthPasswordField: FC<AuthPasswordFieldProps> = (props) => {
  const { policy } = props?.FieldProps ?? {};
  const [tooltipAnchor, setTooltipAnchor] = useState<null | HTMLElement>(null);
  const tooltipOpen = Boolean(tooltipAnchor);

  const openTooltip = (e: React.FormEvent<HTMLElement>) => {
    setTooltipAnchor(e.currentTarget);
  };

  const closeTooltip = (e: React.FormEvent<HTMLElement>) => {
    if (!!props?.formik) {
      props.formik.handleBlur(e);
    }
    setTooltipAnchor(null);
  };

  return (
    <>
      <StringField
        {...props}
        // @ts-ignore
        FieldProps={merge(props.FieldProps ?? {}, {
          type: "password",
          InputProps: {
            onFocus: openTooltip,
            onBlur: closeTooltip,
          },
        })}
      />
      {!!policy && (
        <Popper
          open={tooltipOpen}
          anchorEl={tooltipAnchor}
          disablePortal={true}
          placement="right"
          modifiers={[
            {
              name: "offset",
              options: {
                offset: [0, 60],
              },
            },
          ]}
        >
          <PasswordRequirementDisplay value={props.value} policy={policy} />
        </Popper>
      )}
    </>
  );
};

export default AuthPasswordField;
