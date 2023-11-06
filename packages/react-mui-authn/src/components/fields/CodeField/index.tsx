import { FC } from "react";
import { Typography } from "@mui/material";

import { FieldComponentProps } from "../types";
import CodeInput from "./CodeInput";

const CodeField: FC<FieldComponentProps> = ({ name, formik, disabled }) => {
  return (
    <>
      <CodeInput
        value={formik?.values[name] ?? ""}
        onFinish={() => {
          if (!formik?.isSubmitting) {
            formik?.submitForm();
          }
        }}
        onChange={(value) => {
          formik?.setFieldValue(name, value);
          if (!formik?.touched[name] && !!formik?.values[name]) {
            formik?.setFieldTouched(name, true);
          }
        }}
        disabled={disabled}
      />
      {(formik?.errors ?? {})[name] && (formik?.touched ?? {})[name] && (
        <Typography color="error" variant="body2">
          {formik?.errors[name]}
        </Typography>
      )}
    </>
  );
};

export default CodeField;
