import { FC } from "react";
import { Divider, Grid } from "@mui/material";

import FieldComponent from "./FieldComponent";
import { FieldFormSchema, FormFieldLabelProps } from "./types";
import { FormikObject } from "./types/formik";

const Fields: FC<{
  formik: FormikObject;
  fields: FieldFormSchema[];
  width?: string;
  disabled?: boolean;
  useDivider?: boolean;
  spacing?: number;
  LabelProps?: FormFieldLabelProps;
}> = ({
  fields,
  formik,
  width = "100%",
  disabled,
  useDivider,
  spacing = 1,
  LabelProps,
}) => {
  return (
    <>
      {fields.map(({ name, ...field }) => {
        if (field?.isHidden && field.isHidden(formik?.values ?? {})) {
          return null;
        }

        return (
          <Grid
            item
            style={{
              // FIXME: This is a hack. We need to update the schema
              //  to be able to specify separate values
              width:
                (typeof field?.width === "string" ? field?.width : undefined) ??
                width,
            }}
            key={`grid-item-${name}`}
          >
            <FieldComponent
              field={field}
              name={name ?? field.label}
              formik={formik}
              disabled={disabled}
              LabelProps={LabelProps}
            />
            {useDivider && <Divider sx={{ paddingTop: 2 }} />}
          </Grid>
        );
      })}
    </>
  );
};

export default Fields;
