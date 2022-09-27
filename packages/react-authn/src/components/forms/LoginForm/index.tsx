import { FC, MouseEventHandler, useState } from "react";

// material-ui
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
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

import {
  Visibility,
  VisibilityOff
} from "@mui/icons-material";

interface LoginFormProps {
  formHeading?: string;
  socialHeading?: string;
  submitLabel?: string;
}

const LoginForm: FC<LoginFormProps> = ({
  formHeading = "Sign in",
  socialHeading = "Other ways to Sign in",
  submitLabel = "Create account"
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
    password: Yup.string()
      .max(255)
      .required("Password is required"),
  });

  const handleSubmit = (values: any, actions: FormikHelpers<any>) => {
    // do nothing for now

    setTimeout(() => {
      actions.setSubmitting(false);
    }, 1000);
  };

  return (
    <Grid container direction="column">
      <Grid item mb={2}>
        <Typography variant="h5" sx={{ textAlign: "center" }}>
          {formHeading}
        </Typography>
      </Grid>

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
                <FormHelperText
                  error
                  id="standard-weight-helper-text-username-login"
                >
                  {errors.username}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl
              fullWidth
              error={Boolean(touched.password && errors.password)}
              variant="outlined"
              sx={{ mt: 2 }} 
            >
              <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                onChange={handleChange('password')}
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
                <FormHelperText
                  error
                  id="standard-weight-helper-text-password-login"
                >
                  {errors.password}
                </FormHelperText>
              )}
            </FormControl>

            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              <Button
                disableElevation
                disableRipple
                disabled={isSubmitting}
                fullWidth
                size="medium"
                type="submit"
                color="primary"
              >
                {submitLabel}
              </Button>
            </Box>
          </form>
        )}
      </Formik>

      <Stack spacing={1.5} sx={{ textAlign: "center" }} mt={2} mb={2}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Divider sx={{ flexGrow: 1 }} />
          <Typography variant="overline">{socialHeading}</Typography>
          <Divider sx={{ flexGrow: 1 }} />
        </Stack>
        <Button variant="outlined" color="secondary" fullWidth>
          Sign in with Google
        </Button>
        <Button variant="outlined" color="secondary" fullWidth>
          Sign in with Github
        </Button>
      </Stack>

      <Grid
        item
        container
        direction="row"
        alignItems="center"
        justifyContent="center"
        spacing={1}
      >
        <Grid item>
          <Typography
            variant="caption"
            sx={{ textDecoration: "none", cursor: "pointer" }}
          >
            <Link href="#" underline="none">
              Forgot password?
            </Link>
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="caption">
            <Link href="#" underline="none">
              Sign up for an account
            </Link>
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default LoginForm;
