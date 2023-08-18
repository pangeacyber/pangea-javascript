import { FC, useMemo } from "react";
import map from "lodash/map";
import get from "lodash/get";
import some from "lodash/some";
import { Stack } from "@mui/material";
import { useTheme, lighten } from "@mui/material/styles";

import { Audit } from "../../types";

import StringJsonField, {
  DateTimeField,
  StringField,
  StringFieldProps,
} from "../AuditStringJsonField";
import OldNewFields from "../AuditOldNewFields";
import VerificationLine from "./VerificationLine";

interface Props {
  record: Audit.FlattenedAuditRecord;
  isVerificationCheckEnabled?: boolean;
  schema: Audit.Schema;
}

const NoopField = (props: any) => null;

const getFieldComponent = (field: Audit.SchemaField): FC<StringFieldProps> => {
  if (field.id === "new" || field.id === "old") {
    // SpecialField: Old and New we do a special comparison field
    return NoopField;
  }

  if (field.type === "datetime") {
    return DateTimeField;
  }

  if (field.type === "string" || field.type === "string-unindexed") {
    return StringJsonField;
  }

  return StringField;
};

const AuditPreviewRow: FC<Props> = ({
  record,
  isVerificationCheckEnabled = true,
  schema,
}) => {
  const theme = useTheme();

  const fields = useMemo(() => {
    const schemaFields = schema?.fields ?? [];

    return map(schemaFields, (field) => ({
      title: field.name ?? field.id,
      id: field.id,
      FieldComp: getFieldComponent(field),
    }));
  }, [schema]);

  const hasOldNew = useMemo(() => {
    const schemaFields = schema?.fields ?? [];

    return some(
      schemaFields,
      (field) => field.id === "old" || field.id === "new"
    );
  }, [schema]);

  // @ts-ignore - An id is needed for mui data grid so one is added.
  const rowId: string = record.id;

  // @ts-ignore - Is an internal optional field used when some incorrect fields are logged
  const hasErrorValues = !!record.err;

  return (
    <Stack
      padding={1}
      pl="19.5px"
      mb={0.5}
      className="PangeaDataGrid-ExpansionRow"
      sx={{
        display: "grid",
        borderBottomLeftRadius: "4px",
        borderBottomRightRadius: "4px",
        backgroundColor: lighten(theme.palette.secondary.main, 0.9),
      }}
    >
      <Stack pl={"0px"} direction="row" sx={{ width: "100%" }}>
        {isVerificationCheckEnabled && <VerificationLine record={record} />}
        <Stack
          sx={{ display: "grid", width: "100%", pl: 3, pb: 1 }}
          spacing={-1}
        >
          <Stack spacing={-1}>
            {fields.map((field, idx) => {
              const { FieldComp, title } = field;

              return (
                <FieldComp
                  key={`preview-field-${idx}-${rowId}`}
                  title={title}
                  value={get(record, field.id)}
                  uniqueId={rowId}
                />
              );
            })}
          </Stack>
          {hasOldNew && (
            <OldNewFields
              event={{
                // @ts-ignore
                old: record.old,
                // @ts-ignore
                new: record.new,
              }}
              direction="row"
              uniqueId={rowId}
            />
          )}
          {hasErrorValues && (
            <StringJsonField
              value={get(record, "err")}
              title="Errors"
              uniqueId={rowId}
            />
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default AuditPreviewRow;
