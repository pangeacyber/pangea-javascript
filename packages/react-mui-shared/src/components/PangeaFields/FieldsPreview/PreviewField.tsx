import { FC } from "react";
import startCase from "lodash/startCase";
import { Stack, Grid } from "@mui/material";

import { FormObject } from "../types";
import {
  PreviewFieldSchema,
  PreviewFieldType,
  PreviewFieldValueProps,
} from "./types";
import {
  BooleanPreviewField,
  DatePreviewField,
  DateTimePreviewField,
  JsonPreviewField,
  RelativeDateRangePreviewField,
  StringArrayPreviewField,
  StringPreviewField,
  StringWithCopyPreviewField,
} from "./renderers";
import FieldLabel, { LabelProps } from "../FieldLabel";

const FIELD_RENDERERS: Record<PreviewFieldType, FC<PreviewFieldValueProps>> = {
  string: StringPreviewField,
  stringWithCopy: StringWithCopyPreviewField,
  boolean: BooleanPreviewField,
  json: JsonPreviewField,
  date: DatePreviewField,
  dateTime: DateTimePreviewField,
  relativeDateRange: RelativeDateRangePreviewField,
  stringArray: StringArrayPreviewField,
};

export const getPreviewFieldComp = (
  type: PreviewFieldType
): FC<PreviewFieldValueProps> => {
  return FIELD_RENDERERS[type];
};

interface Props<T extends FormObject> {
  schema: PreviewFieldSchema<T>;
  data: Partial<T>;
  value: any;
  fieldKey: string;
  LabelPropDefaults?: Partial<LabelProps>;
}

const PreviewField = <T extends FormObject>({
  schema,
  data,
  value,
  fieldKey,
  LabelPropDefaults = {},
}: Props<T>): JSX.Element => {
  const { LabelProps = {}, ValueRenderer } = schema;
  const ValueRenderer_ =
    ValueRenderer ?? getPreviewFieldComp(schema.type ?? "string");

  return (
    <Grid item sx={{ width: "100%" }}>
      <Stack
        direction={LabelProps.placement === "top" ? undefined : "row"}
        alignItems={LabelProps.placement === "top" ? "start" : "center"}
        spacing={1}
      >
        <FieldLabel
          label={schema.label}
          fieldName={fieldKey}
          {...LabelPropDefaults}
          {...LabelProps}
        />
        <ValueRenderer_
          value={value}
          fieldType={schema.type ?? "string"}
          label={schema.label ?? startCase(fieldKey)}
          data={data}
          fieldKey={fieldKey}
        />
        {schema?.renderControls && schema.renderControls(data, fieldKey)}
      </Stack>
    </Grid>
  );
};

export default PreviewField;
