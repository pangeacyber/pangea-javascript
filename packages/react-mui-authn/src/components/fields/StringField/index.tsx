import { FC } from "react";
import { FormControl, FormHelperText, OutlinedInput } from "@mui/material";

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
        {...emailProps}
      />
      {formik.errors[name] && (
        <FormHelperText error>{formik.errors[name]}</FormHelperText>
      )}
    </FormControl>
    // <TextField
    //   fullWidth
    //   id={name}
    //   name={name}
    //   label={label}
    //   value={formik.values[name]}
    //   onChange={formik.handleChange}
    //   error={formik.touched[name] && Boolean(formik.errors[name])}
    //   helperText={formik.touched[name] && formik.errors[name]}
    //   autoFocus={autoFocus}
    //   autoComplete={autoComplete}
    //   {...emailProps}
    // />
  );
};

export default StringField;
