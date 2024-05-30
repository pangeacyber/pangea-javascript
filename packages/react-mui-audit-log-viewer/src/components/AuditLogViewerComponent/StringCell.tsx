import { Typography } from "@mui/material";
import { FC, ReactNode } from "react";
import { Audit } from "../../types";
import {
  getFieldMatches,
  injectFPEMatchesIntoChanges,
  useFpeContext,
} from "../../hooks/fpe";
import { Change } from "../../hooks/diff";
import { ChangesTypography } from "../AuditStringJsonField";

export const StringCell: FC<{
  id: string;
  field: string;
  value: ReactNode;
  row: Audit.FlattenedAuditRecord;
}> = (params) => {
  const { value, row, field, id } = params;

  const context = useFpeContext(row);

  let changes: Change[] = [
    {
      // @ts-ignore
      value: `${value}`,
    },
  ];

  try {
    const matches = getFieldMatches(field, context);
    changes = injectFPEMatchesIntoChanges(matches, changes);
  } catch {
    // Unable to generate changes based on fpe matches
  }

  return (
    <ChangesTypography
      value={`${value}`}
      changes={changes}
      uniqueId={`row-${id}-${field}`}
    />
  );
};
