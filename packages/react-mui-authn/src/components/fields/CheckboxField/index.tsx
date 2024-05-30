import { ChangeEvent, FC, useEffect, useState } from "react";
import { Checkbox, FormControlLabel, Typography } from "@mui/material";

export interface Props {
  name: string;
  label: string;
  formik: any;
}

const CheckboxField: FC<Props> = ({ name, label, formik }) => {
  const [checked, setChecked] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    formik.setFieldValue(name, event.target.checked.toString());
  };

  useEffect(() => {
    formik.setFieldValue(name, "false");
  }, []);

  return (
    <FormControlLabel
      label={<Typography variant="body2">{label}</Typography>}
      name={name}
      sx={{ textAlign: "left" }}
      control={<Checkbox checked={checked} onChange={handleChange} />}
    />
  );
};

export default CheckboxField;
