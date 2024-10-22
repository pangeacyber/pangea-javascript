import { FC, useMemo } from "react";
import map from "lodash/map";
import get from "lodash/get";
import some from "lodash/some";
import find from "lodash/find";

import { Stack } from "@mui/material";
import { useTheme, lighten, darken } from "@mui/material/styles";

import { Audit } from "../../types";

import StringJsonField, {
  BooleanField,
  DateTimeField,
  StringField,
  StringFieldProps,
} from "../AuditStringJsonField";
import OldNewFields from "../AuditOldNewFields";
import VerificationLine from "./VerificationLine";
import {
  getFieldMatches,
  injectFPEMatchesIntoChanges,
  useFpeContext,
} from "../../hooks/fpe";
import { Change } from "../../hooks/diff";

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

  if (field.type === "boolean") {
    return BooleanField;
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

  const context = useFpeContext(record);

  const modify = theme.palette.mode === "dark" ? darken : lighten;
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
        backgroundColor: modify(theme.palette.secondary.main, 0.9),
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

              let changes: Change[] = [];
              try {
                const matches = getFieldMatches(field.id, context);
                changes = injectFPEMatchesIntoChanges(matches, [
                  {
                    value: get(record, field.id),
                  },
                ]);
              } catch {
                // Unable to generate changes based on fpe matches
              }

              return (
                <FieldComp
                  key={`preview-field-${idx}-${rowId}`}
                  title={title}
                  field={field.id}
                  value={get(record, field.id)}
                  uniqueId={rowId}
                  changes={changes}
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
              oldField={find(fields, (f) => f.id === "old")}
              newField={find(fields, (f) => f.id === "new")}
              direction="row"
              uniqueId={rowId}
              context={context}
            />
          )}
          {hasErrorValues && (
            <StringJsonField
              value={get(record, "err")}
              title="Errors"
              field="err"
              uniqueId={rowId}
            />
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default AuditPreviewRow;
