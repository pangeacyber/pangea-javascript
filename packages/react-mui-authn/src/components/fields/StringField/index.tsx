import { FC, ReactNode, useEffect, useState } from "react";
import { FormControl, OutlinedInput, Tooltip } from "@mui/material";
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
  const [endIcon, setEndIcon] = useState<ReactNode>();
  const [showStatus, setShowStatus] = useState<boolean>(false);

  const handleBlur = () => setShowStatus(true);
  const emailProps =
    type === "email" ? { autoCapitalize: "none", autoCorrect: "off" } : {};

  const getEndIcon = () => {
    if (!showStatus || !formik.values[name]) {
      return null;
    }

    if (!!formik.errors[name]) {
      return (
        <Tooltip title={formik.errors[name]}>
          <ErrorRounded fontSize="medium" color="error" />
        </Tooltip>
      );
    }

    return <Check fontSize="medium" color="success" />;
  };

  useEffect(() => {
    setEndIcon(getEndIcon());
  }, [formik.errors, showStatus]);

  return (
    <FormControl variant="outlined" fullWidth error={!!formik.errors[name]}>
      <OutlinedInput
        id={`outlined-adornment-${name}`}
        name={name}
        type={type}
        error={!!formik.errors[name]}
        onChange={formik.handleChange}
        onBlur={handleBlur}
        autoFocus={autoFocus}
        autoComplete={autoComplete}
        value={formik.values[name]}
        placeholder={label}
        endAdornment={endIcon}
        {...emailProps}
      />
    </FormControl>
  );
};

export default StringField;
