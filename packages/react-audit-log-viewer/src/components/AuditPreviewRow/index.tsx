import { FC } from "react";
import { Stack, Box } from "@mui/material";

import { Audit } from "../../types";

import StringJsonField, { StringField } from "../AuditStringJsonField";
import OldNewFields from "../AuditOldNewFields";
import { useAuditContext, useVerification } from "../../hooks/context";

interface Props {
  record: Audit.AuditRecord;
}

const AuditPreviewRow: FC<Props> = ({ record }) => {
  const { visibilityModel } = useAuditContext();
  const { isConsistentWithNext } = useVerification(record);

  // @ts-ignore - An id is needed for mui data grid so one is added.
  const rowId: string = record.id;

  return (
    <Stack
      padding={1}
      pl="19.5px"
      mb={0.5}
      sx={{
        backgroundColor: "black", // FIXME Colors TableHeader
        display: "grid",
        borderBottomLeftRadius: "4px",
        borderBottomRightRadius: "4px",
      }}
    >
      <Stack pl={"0px"} direction="row" sx={{ width: "100%" }}>
        <Box
          sx={{
            backgroundColor: isConsistentWithNext
              ? "green" // FIXME: Colors SuccessGreen
              : "transparent",
            width: "1px!important",
            display: "flex",
            margin: -1,
            marginRight: 2,
            marginLeft: 0,
            marginBottom: -1.5,
          }}
        />
        <Stack
          sx={{ display: "grid", width: "100%", pl: 3, pb: 1 }}
          spacing={-1}
        >
          <Stack spacing={-1}>
            {!visibilityModel?.actor && (
              <StringField
                title="Actor"
                value={record.actor}
                uniqueId={rowId}
              />
            )}
            {!visibilityModel?.action && (
              <StringField
                title="Action"
                value={record.action}
                uniqueId={rowId}
              />
            )}
            {!visibilityModel?.status && (
              <StringField
                title="Status"
                value={record.status}
                uniqueId={rowId}
              />
            )}
            {!visibilityModel?.target && (
              <StringField
                title="Target"
                value={record.target}
                uniqueId={rowId}
              />
            )}
            {!visibilityModel?.source && (
              <StringField
                title="Source"
                value={record.source}
                uniqueId={rowId}
              />
            )}
            {!visibilityModel?.message && (
              <StringJsonField
                title="Message"
                value={record.message}
                uniqueId={rowId}
              />
            )}
          </Stack>
          <OldNewFields record={record} direction="row" uniqueId={rowId} />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default AuditPreviewRow;
