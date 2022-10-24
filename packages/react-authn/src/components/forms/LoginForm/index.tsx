import { FC, MouseEventHandler, useState } from "react";

// material-ui
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";

import * as Yup from "yup";
import { Formik, FormikHelpers } from "formik";

import { Visibility, VisibilityOff } from "@mui/icons-material";

import GoogleIcon from "@src/components/Icons/google";
import GitHubIcon from "@src/components/Icons/github";

interface LoginFormProps {
  formHeading?: string;
  socialHeading?: string;
  submitLabel?: string;
  showSocialIcons?: boolean;
}

const LoginForm: FC<LoginFormProps> = ({
  formHeading = "Sign in",
  socialHeading = "Other ways to Sign in",
  submitLabel = "Sign in",
  showSocialIcons = true,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword: MouseEventHandler = (event) => {
    event.preventDefault();
  };

  const initialValues = {
    username: "",
    password: "",
    submit: null,
  };

  const validateSchema = Yup.object().shape({
    username: Yup.string()
      .email("Must be a valid email")
      .max(255)
      .required("Email is required"),
    password: Yup.string().max(255).required("Password is required"),
  });

  const handleSubmit = (values: any, actions: FormikHelpers<any>) => {
    // do nothing for now

    setTimeout(() => {
      actions.setSubmitting(false);
    }, 1000);
  };

  const socialButtonStyle = {
    display: "flex",
    marginRight: "4px",
    marginTop: "-2px",
  };

  return (
    <Stack direction="column">
      <Stack mb={3}>
        <Typography
          variant="h6"
          sx={{ textAlign: "center", fontWeight: "600" }}
        >
          {formHeading}
        </Typography>
      </Stack>
      <Formik
        onSubmit={handleSubmit}
        initialValues={initialValues}
        validationSchema={validateSchema}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          touched,
          values,
        }) => (
          <form noValidate onSubmit={handleSubmit}>
            <FormControl
              fullWidth
              error={Boolean(touched.username && errors.username)}
              variant="outlined"
            >
              <InputLabel htmlFor="outlined-adornment-username-login">
                Email
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-username"
                type="email"
                value={values.username}
                name="username"
                onBlur={handleBlur}
                onChange={handleChange}
                inputProps={{}}
                label="Email"
              />
              {touched.username && errors.username && (
                <FormHelperText error>{errors.username}</FormHelperText>
              )}
            </FormControl>
            <FormControl
              fullWidth
              error={Boolean(touched.password && errors.password)}
              variant="outlined"
              sx={{ mt: 1 }}
            >
              <InputLabel htmlFor="outlined-adornment-password">
                Password
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? "text" : "password"}
                value={values.password}
                onChange={handleChange("password")}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
              {touched.password && errors.password && (
                <FormHelperText error>{errors.password}</FormHelperText>
              )}
            </FormControl>

            {errors.submit && (
              <Box sx={{ mt: 1 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}

            <Box sx={{ mt: 1 }}>
              <Button
                disableElevation
                disableRipple
                disabled={isSubmitting}
                fullWidth
                type="submit"
                color="primary"
              >
                {submitLabel}
              </Button>
            </Box>
          </form>
        )}
      </Formik>

      <Stack sx={{ marginTop: "24px", textAlign: "center" }}>
        <Stack
          direction="row"
          spacing={1}
          sx={{ marginBottom: "24px" }}
          alignItems="center"
        >
          <Divider sx={{ flexGrow: 1 }} />
          <Typography variant="overline">{socialHeading}</Typography>
          <Divider sx={{ flexGrow: 1 }} />
        </Stack>
        <Stack spacing={1}>
          <Button disableElevation disableRipple fullWidth color="secondary">
            {showSocialIcons && (
              <Box sx={socialButtonStyle}>
                <GoogleIcon />
              </Box>
            )}
            Sign in with Google
          </Button>
          <Button disableElevation disableRipple fullWidth color="secondary">
            {showSocialIcons && (
              <Box sx={socialButtonStyle}>
                <GitHubIcon />
              </Box>
            )}
            Sign in with Github
          </Button>
        </Stack>
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        spacing={1}
        sx={{ marginTop: "24px" }}
      >
        <Stack direction="row" spacing={1}>
          <Typography
            variant="caption"
            sx={{ textDecoration: "none", cursor: "pointer" }}
          >
            <Link href="#" underline="none">
              Forgot password?
            </Link>
          </Typography>
          <Typography variant="body2">
            <Link href="#" underline="none">
              Sign up for an account
            </Link>
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default LoginForm;
