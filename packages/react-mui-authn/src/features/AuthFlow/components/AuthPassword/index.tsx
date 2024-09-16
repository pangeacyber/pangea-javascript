import { FC, useEffect, useState } from "react";
import omit from "lodash/omit";
import { useFormik } from "formik";
import * as yup from "yup";
import { Stack } from "@mui/material";

import { AuthFlow } from "@pangeacyber/vanilla-js";

import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import ErrorMessage from "../ErrorMessage";
import Button from "@src/components/core/Button";
import PasswordField, {
  checkPassword,
} from "@src/components/fields/PasswordField";
import StringField from "@src/components/fields/StringField";
import VerifyCaptcha from "../VerifyCaptcha";
import RememberUser from "../RememberUser";
import PasskeyAuth from "../PasskeyAuth";

const AuthPassword: FC<AuthFlowComponentProps> = (props) => {
  const { options, data, loading, error, update, restart } = props;
  const [status, setStatus] = useState<any>();
  const [captcha, setCaptcha] = useState("");
  const enrollment = !!data?.password?.enrollment || data?.setPassword;
  const showReset = !!data.resetPassword && !data.setPassword;
  const showPasswordConfirmation = !!data.resetPassword && !!data.setPassword;
  const showEmail = !!data.password?.need_email;
  const passwordPolicy = enrollment
    ? data?.password?.password_policy || data?.setPassword?.password_policy
    : null;
  const validationSchema = yup.object({
    password: enrollment
      ? yup
          .string()
          .required("Required")
          .test(
            "password-requirements",
            "Password must meet requirements",
            (value) => {
              return checkPassword(value, passwordPolicy);
            }
          )
      : yup.string().required("Required"),
    confirm_password: showPasswordConfirmation
      ? yup
          .string()
          .required("New password must be confirmed.")
          .oneOf([yup.ref("password")], "Passwords must match.")
      : yup.string().nullable(),
    email: showEmail
      ? yup.string().required("Required").email("Enter a valid email")
      : yup.string().nullable(),
  });

  const formik = useFormik({
    initialValues: {
      password: "",
      confirm_password: "",
      email: showEmail ? "" : undefined,
    },
    validationSchema: validationSchema,
    validateOnBlur: true,
    onSubmit: (values) => {
      const payload: AuthFlow.PasswordParams = {
        ...omit(values, ["confirm_password"]),
      };

      if (data.setPassword) {
        update(AuthFlow.Choice.SET_PASSWORD, payload);
      } else {
        // pass captcha code as extra param for combined password/captcha view
        update(AuthFlow.Choice.PASSWORD, payload, captcha);
      }
    },
  });

  useEffect(() => {
    setStatus(error);
  }, [error]);

  const forgot = () => {
    restart(AuthFlow.Choice.RESET_PASSWORD);
  };

  const submitCaptcha = (code: string) => {
    setCaptcha(code);
  };

  const getSubmitLabel = (): string => {
    if (data.setPassword) {
      return "Reset";
    }

    if (data.password?.enrollment) {
      return options.signupButtonLabel || "Continue";
    }

    if (data.phase === "phase_one_time") {
      return "Continue";
    }

    return options.passwordButtonLabel || "Log in";
  };

  return (
    <Stack gap={2} width="100%">
      <form
        style={{ width: "100%" }}
        onSubmit={formik.handleSubmit}
        onFocus={() => {
          setStatus(undefined);
        }}
      >
        <Stack gap={1}>
          {showEmail && (
            <StringField
              name="email"
              type="email"
              label="Email"
              formik={formik}
              autoComplete="email"
              autoFocus={true}
              hideLabel={true}
            />
          )}
          <PasswordField
            name="password"
            label="Password"
            formik={formik}
            policy={passwordPolicy}
            autofocus={!showEmail}
          />
          {showPasswordConfirmation && (
            <PasswordField
              name="confirm_password"
              label="Confirm password"
              formik={formik}
              autofocus={false}
            />
          )}
          {!!data.captcha && options.compactSignup && (
            <VerifyCaptcha {...props} submitHandler={submitCaptcha} />
          )}
          {status && <ErrorMessage response={status} />}
          <Stack gap={1}>
            <Button
              color="primary"
              type="submit"
              disabled={loading || (!!data.captcha && !captcha)}
              fullWidth={true}
            >
              {getSubmitLabel()}
            </Button>
            <PasskeyAuth {...props} />
            {(options.rememberUser || showReset) && (
              <Stack
                direction="row"
                justifyContent={showReset ? "space-between" : "flex-start"}
              >
                {options.rememberUser &&
                  !enrollment &&
                  data.phase !== "phase_one_time" && (
                    <RememberUser {...props} />
                  )}
                {showReset && (
                  <Button
                    variant="text"
                    onClick={forgot}
                    sx={{ paddingLeft: 0, paddingRight: 0 }}
                  >
                    Forgot password?
                  </Button>
                )}
              </Stack>
            )}
          </Stack>
        </Stack>
      </form>
    </Stack>
  );
};

export default AuthPassword;
