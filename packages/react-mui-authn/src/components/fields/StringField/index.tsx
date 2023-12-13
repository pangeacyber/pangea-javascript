import { FC } from "react";
import {
  FormControl,
  FormHelperText,
  InputAdornment,
  OutlinedInput,
  Tooltip,
} from "@mui/material";
import { Check, ErrorRounded } from "@mui/icons-material";

export interface Props {
  name: string;
  label: string;
  formik: any;
  type?: "text" | "email" | "number";
  autoFocus?: boolean;
  autoComplete?: string;
}

const StringField: FC<Props> = ({
  name,
  label,
  formik,
  type = "text",
  autoFocus = false,
  autoComplete,
}) => {
  const emailProps =
    type === "email" ? { autoCapitalize: "none", autoCorrect: "off" } : {};

  const getEndIcon = () => {
    if (!formik.touched[name]) {
      return null;
    }

    if (formik.touched[name] && formik.errors[name]) {
      return (
        <Tooltip title={formik.errors[name]}>
          <ErrorRounded fontSize="medium" color="error" />
        </Tooltip>
      );
    }

    return <Check fontSize="medium" color="success" />;
  };

  return (
    <FormControl
      variant="outlined"
      fullWidth
      error={Boolean(formik.touched[name] && Boolean(formik.errors[name]))}
    >
      <OutlinedInput
        id={`outlined-adornment-${name}`}
        name={name}
        type={type}
        error={formik.touched[name] && formik.errors[name]}
        onChange={formik.handleChange}
        autoFocus={autoFocus}
        autoComplete={autoComplete}
        value={formik.values[name]}
        placeholder={label}
        endAdornment={getEndIcon()}
        {...emailProps}
      />
    </FormControl>
  );
};

export default StringField;
