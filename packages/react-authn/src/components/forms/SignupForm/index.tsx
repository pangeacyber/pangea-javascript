import { FC, MouseEventHandler, useState } from "react";

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
  TextField,
  Typography,
} from "@mui/material";

import * as Yup from "yup";
import { Formik, FormikHelpers } from "formik";

import {
  Visibility,
  VisibilityOff
} from "@mui/icons-material";

interface SignupFormProps {
  formTitle?: string;
  socialTitle?: string;
  submitLabel?: string;
  buttonVariant?: "contained" | "outlined",
};

const SignupForm: FC<SignupFormProps> = ({
  formTitle = "Create your account",
  socialTitle = "Other Sign Up Options",
  submitLabel = "Create account",
  buttonVariant = "contained"
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
    <Grid container direction="column">
      <Grid item mb={2}>
        <Typography variant="h4" sx={{ textAlign: "center" }}>
          {formTitle}
        </Typography>
      </Grid>

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
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  margin="normal"
                  name="first_name"
                  type="text"
                  value={values.first_name}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  inputProps={{}}
                  variant="outlined"
                />
                {touched.first_name && errors.first_name && (
                  <FormHelperText
                    error
                    id="standard-weight-helper-text-first_name-register"
                  >
                    {errors.first_name}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
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
                />
                {touched.last_name && errors.last_name && (
                  <FormHelperText
                    error
                    id="standard-weight-helper-text-last_name-register"
                  >
                    {errors.last_name}
                  </FormHelperText>
                )}
              </Grid>
            </Grid>
            <FormControl
              fullWidth
              error={Boolean(touched.email && errors.email)}
              variant="outlined"
              sx={{ mt: 2 }}
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
                <FormHelperText
                  error
                  id="standard-weight-helper-text-email-register"
                >
                  {errors.email}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl
              fullWidth
              error={Boolean(touched.password && errors.password)}
              variant="outlined"
              sx={{ mt: 2 }}
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
                <FormHelperText
                  error
                  id="standard-weight-helper-text-password-register"
                >
                  {errors.password}
                </FormHelperText>
              )}
            </FormControl>

            <Grid item></Grid>
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
                variant={buttonVariant}
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
          <Typography variant="overline">{socialTitle}</Typography>
          <Divider sx={{ flexGrow: 1 }} />
        </Stack>
        <Button variant="outlined" color="secondary" fullWidth>
          Sign up with Google
        </Button>
        <Button variant="outlined" color="secondary" fullWidth>
          Sign up with Github
        </Button>
      </Stack>

      <Grid
        container
        item
        direction="row"
        alignItems="center"
        justifyContent="center"
        xs={12}
      >
        <Typography variant="caption">
          Already have an account?
          {" "}
          <Link href="#" underline="none">
            Sign in here
          </Link>
        </Typography>
      </Grid>
    </Grid>
  );
};

export default SignupForm;
