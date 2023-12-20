import { FC, FormEvent, MouseEvent, useState } from "react";
import {
  FormControl,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Tooltip,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import { validatePassword } from "@src/utils";
import PasswordRequirements from "@src/components/core/PasswordRequirements";

export interface Props {
  name: string;
  label: string;
  formik: any;
  policy?: any;
}

// password requirements validator for yup
export const checkPassword = (value: string | undefined, policy: any) => {
  const matches = validatePassword(value || "", policy);
  return Object.keys(matches).length === 0;
};

const PasswordField: FC<Props> = ({ name, label, formik, policy }) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showStatus, setShowStatus] = useState<boolean>(false);

  const handleBlur = () => setShowStatus(true);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <>
      <FormControl variant="outlined" fullWidth error={!!formik.errors[name]}>
        <OutlinedInput
          id={`outlined-adornment-${name}`}
          name={name}
          type={showPassword ? "text" : "password"}
          error={formik.touched[name] && formik.errors[name]}
          onChange={formik.handleChange}
          onBlur={handleBlur}
          autoComplete={policy ? "new-password" : "current-password"}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                color={
                  showStatus && !!formik.errors[name] ? "error" : "default"
                }
              >
                <Tooltip title={formik.errors[name]}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </Tooltip>
              </IconButton>
            </InputAdornment>
          }
          value={formik.values[name]}
          placeholder={label}
          autoFocus
        />
      </FormControl>
      <PasswordRequirements value={formik.values[name]} policy={policy} />
    </>
  );
};

export default PasswordField;
