import { FC, MouseEventHandler, useState } from "react";

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
  TextField,
  Typography,
} from "@mui/material";

import * as Yup from "yup";
import { Formik, FormikHelpers } from "formik";

import { Visibility, VisibilityOff } from "@mui/icons-material";

interface SignupFormProps {
  formHeading?: string;
  socialHeading?: string;
  submitLabel?: string;
}

const SignupForm: FC<SignupFormProps> = ({
  formHeading = "Create your account",
  socialHeading = "Other Sign Up Options",
  submitLabel = "Create account",
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword: MouseEventHandler = (event) => {
    event.preventDefault();
  };

  const changePassword = (value: string) => {
    // TODO: show password requirements
  };

  const initialValues = {
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    submit: null,
  };

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().max(255).required("First Name is required"),
    last_name: Yup.string().max(255).required("Last Name is required"),
    email: Yup.string()
      .email("Must be a valid email")
      .max(255)
      .required("Email is required"),
    password: Yup.string().max(255).required("Password is required"),
  });

  const submitHandler = (values: any, actions: FormikHelpers<any>) => {
    // do nothing for now

    setTimeout(() => {
      actions.setSubmitting(false);
    }, 1000);
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
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={submitHandler}
        enableReinitialize
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
            <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
              <Stack direction="column">
                <TextField
                  fullWidth
                  label="First Name"
                  name="first_name"
                  type="text"
                  value={values.first_name}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  inputProps={{}}
                  variant="outlined"
                  sx={{ margin: 0 }}
                />
                {touched.first_name && errors.first_name && (
                  <FormHelperText error>
                    {errors.first_name}
                  </FormHelperText>
                )}
              </Stack>
              <Stack direction="column">
                <TextField
                  fullWidth
                  label="Last Name"
                  margin="normal"
                  name="last_name"
                  type="text"
                  value={values.last_name}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  inputProps={{}}
                  variant="outlined"
                  sx={{ margin: 0 }}
                />
                {touched.last_name && errors.last_name && (
                  <FormHelperText error>
                    {errors.last_name}
                  </FormHelperText>
                )}
              </Stack>
            </Stack>
            <FormControl
              fullWidth
              error={Boolean(touched.email && errors.email)}
              variant="outlined"
              sx={{ mt: 1 }}
            >
              <InputLabel htmlFor="outlined-adornment-email-register">
                Email
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-email-register"
                type="email"
                value={values.email}
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                inputProps={{}}
                placeholder="Email"
                label="Email"
              />
              {touched.email && errors.email && (
                <FormHelperText error>
                  {errors.email}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl
              fullWidth
              error={Boolean(touched.password && errors.password)}
              variant="outlined"
              sx={{ mt: 1 }}
            >
              <InputLabel htmlFor="outlined-adornment-password-register">
                Password
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password-register"
                type={showPassword ? "text" : "password"}
                value={values.password}
                name="password"
                onBlur={handleBlur}
                onChange={(e) => {
                  handleChange(e);
                  changePassword(e.target.value);
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                inputProps={{}}
                label="Password"
              />
              {touched.password && errors.password && (
                <FormHelperText error>
                  {errors.password}
                </FormHelperText>
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
        <Stack direction="row" spacing={1} sx={{ marginBottom: "24px" }} alignItems="center">
          <Divider sx={{ flexGrow: 1 }} />
          <Typography variant="overline">{socialHeading}</Typography>
          <Divider sx={{ flexGrow: 1 }} />
        </Stack>
        <Stack spacing={1}>
          <Button
            disableElevation
            disableRipple
            fullWidth
            color="secondary"
          >
            Sign up with Google
          </Button>
          <Button
            disableElevation
            disableRipple
            fullWidth
            color="secondary"
          >
            Sign up with Github
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
        <Typography variant="body2">
          Already have an account?{" "}
          <Link href="#" underline="none">
            Sign in here
          </Link>
        </Typography>
      </Stack>
    </Stack>
  );
};

export default SignupForm;
