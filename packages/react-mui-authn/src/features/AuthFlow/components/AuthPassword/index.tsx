import { FC, useEffect, useState } from "react";
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
import VerifyCaptcha from "../VerifyCaptcha";
import RememberUser from "../RememberUser";

const AuthPassword: FC<AuthFlowComponentProps> = (props) => {
  const { options, data, loading, error, update, restart } = props;
  const [status, setStatus] = useState<any>();
  const [captcha, setCaptcha] = useState("");
  const enrollment = !!data?.password?.enrollment || data?.setPassword;
  const showReset = !!data.resetPassword && !data.setPassword;
  const passwordPolicy = enrollment
    ? { ...data?.password?.password_policy }
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
  });

  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validationSchema: validationSchema,
    validateOnBlur: true,
    onSubmit: (values) => {
      const payload: AuthFlow.PasswordParams = {
        ...values,
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
          <PasswordField
            name="password"
            label="Password"
            formik={formik}
            policy={passwordPolicy}
          />
          {!!data.captcha && options.compactSignup && (
            <VerifyCaptcha {...props} submitHandler={submitCaptcha} />
          )}
          {status && <ErrorMessage response={status} />}
          <Stack gap={showReset ? 0 : 1}>
            <Button
              color="primary"
              type="submit"
              disabled={loading || (!!data.captcha && !captcha)}
              fullWidth={true}
            >
              {getSubmitLabel()}
            </Button>
            {(options.rememberUser || showReset) && (
              <Stack
                direction="row"
                justifyContent={showReset ? "space-between" : "center"}
              >
                {options.rememberUser && <RememberUser {...props} />}
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
