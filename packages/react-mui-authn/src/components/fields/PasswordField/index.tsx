import { FC, FormEvent, MouseEvent, useState } from "react";
import {
  FormControl,
  Popper,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import useMediaQuery from "@mui/material/useMediaQuery";

import PasswordRequirements from "@src/components/core/PasswordRequirements";

export interface Props {
  name: string;
  label: string;
  formik: any;
  policy?: any;
}

const PasswordField: FC<Props> = ({ name, label, formik, policy }) => {
  const tooltipTop = useMediaQuery("(max-width:1500px)");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [tooltipAnchor, setTooltipAnchor] = useState<null | HTMLElement>(null);
  const tooltipOpen = Boolean(tooltipAnchor);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const openTooltip = (e: FormEvent<HTMLElement>) => {
    if (policy) {
      setTooltipAnchor(e.currentTarget);
    }
  };

  const closeTooltip = (e: FormEvent<HTMLElement>) => {
    if (policy) {
      formik.handleBlur(e);
      setTooltipAnchor(null);
    }
  };

  return (
    <>
      <FormControl
        variant="outlined"
        fullWidth
        error={Boolean(formik.touched[name] && formik.errors[name])}
        onFocus={openTooltip}
        onBlur={closeTooltip}
      >
        <InputLabel htmlFor={`outlined-adornment-${name}`}>{label}</InputLabel>
        <OutlinedInput
          id={`outlined-adornment-${name}`}
          name={name}
          type={showPassword ? "text" : "password"}
          onChange={formik.handleChange}
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
          value={formik.values[name]}
          label={label}
        />
      </FormControl>
      <Popper
        open={tooltipOpen}
        anchorEl={tooltipAnchor}
        disablePortal={true}
        placement={tooltipTop ? "top" : "right"}
        sx={{
          zIndex: "100",
        }}
        modifiers={[
          {
            name: "offset",
            options: {
              offset: tooltipTop ? [80, 10] : [0, 20],
            },
          },
        ]}
      >
        <PasswordRequirements
          value={formik.values[name]}
          policy={policy}
          positionTop={tooltipTop}
        />
      </Popper>
    </>
  );
};

export default PasswordField;
