import get from "lodash/get";
import { Stack, Grid } from "@mui/material";

import PreviewField from "./PreviewField";
import { FieldsPreviewSchema, PreviewFieldSchema } from "./types";
import { useGroupedFields } from "../hooks";
import FieldGrouping from "../FieldGrouping";
import { LabelProps } from "../FieldLabel";
import { FormObject } from "../types";

export interface FieldsPreviewProps<T extends FormObject> {
  data: Partial<T>;
  schema: FieldsPreviewSchema<T>;
  LabelPropDefaults?: Partial<LabelProps>;
}

const FieldsPreview = <T extends FormObject>({
  data,
  schema,
  LabelPropDefaults,
}: FieldsPreviewProps<T>): JSX.Element => {
  // @ts-ignore
  const [fields, groups] = useGroupedFields<PreviewFieldSchema<T>>(schema);

  return (
    <Grid container spacing={1} sx={{ marginLeft: "-8px!important" }}>
      {Object.keys(groups).map((groupKey, idx) => {
        const group = groups[groupKey];

        return (
          <FieldGrouping
            key={`field-preview-grouping-${groupKey}-${idx}`}
            label={groupKey}
            metadata={group.metadata}
            values={data}
          >
            {group.fields
              .filter((field) => {
                if (!!field.isHidden) {
                  const isHidden = field.isHidden(data);
                  if (isHidden) return false;
                }
                if (!field.hideIfUndefined) return true;

                // @ts-ignore
                const rawValue = get(data, field.name);

                return rawValue !== undefined;
              })
              .map((fieldSchema) => {
                // @ts-ignore
                const fieldKey = fieldSchema.name;

                const getValue = () => {
                  if (!!fieldSchema?.getValue) {
                    return fieldSchema.getValue(data, fieldKey);
                  }

                  return get(data, fieldKey, "");
                };

                return (
                  <PreviewField
                    key={`preview-field-${fieldKey}`}
                    value={getValue()}
                    data={data}
                    schema={fieldSchema}
                    fieldKey={fieldKey}
                    LabelPropDefaults={LabelPropDefaults}
                  />
                );
              })}
          </FieldGrouping>
        );
      })}
    </Grid>
  );
};

export default FieldsPreview;
