import { FC } from "react";
import { Stack } from "@mui/material";
import { useTheme, lighten } from "@mui/material/styles";

import { Audit } from "../../types";

import StringJsonField, { StringField } from "../AuditStringJsonField";
import OldNewFields from "../AuditOldNewFields";
import { useAuditContext } from "../../hooks/context";
import VerificationLine from "./VerificationLine";

interface Props {
  record: Audit.FlattenedAuditRecord;
  isVerificationCheckEnabled?: boolean;
}

const AuditPreviewRow: FC<Props> = ({
  record,
  isVerificationCheckEnabled = true,
}) => {
  const theme = useTheme();
  const { visibilityModel } = useAuditContext();

  // @ts-ignore - An id is needed for mui data grid so one is added.
  const rowId: string = record.id;

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
