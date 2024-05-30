import { FC, useMemo, useState } from "react";
import isEmpty from "lodash/isEmpty";

import { Stack, Typography, Switch } from "@mui/material";

import { Audit } from "../../types";
import { useDiffWords } from "../../hooks/diff";

import StringJsonField from "../AuditStringJsonField";
import {
  FPEContext,
  getFieldMatches,
  injectFPEMatchesIntoChanges,
  updateMatchesToHaveRelativeRanges,
} from "../../hooks/fpe";

interface Props {
  event: {
    old: string;
    new: string;
  };
  direction: "row" | "column";
  uniqueId: string;
  context?: FPEContext;
}

const OldNewFields: FC<Props> = ({ event, direction, uniqueId, context }) => {
  const changes = useDiffWords(event.old, event.new);

  const oldChanges = useMemo(() => {
    const matches = getFieldMatches("old", context);
    const changes_ = changes.filter((c) => !c.added);

    try {
      // Adjust field FPE matches to be relative to the entire strinified object
      // to work with the used JSONViewer, which does not have support for highlighting
      // values based on their JSON path
      const adjustedMatches = updateMatchesToHaveRelativeRanges(
        event.old ?? "",
        matches
      );
      return injectFPEMatchesIntoChanges(adjustedMatches, changes_);
    } catch {
      // Unable to adjust field matches to be relative to complete string
    }

    return changes_;
  }, []);

  const newChanges = useMemo(() => {
    const matches = getFieldMatches("new", context);
    const changes_ = changes.filter((c) => !c.removed);

    try {
      // Adjust field FPE matches to be relative to the entire strinified object
      // to work with the used JSONViewer, which does not have support for highlighting
      // values based on their JSON path
      const adjustedMatches = updateMatchesToHaveRelativeRanges(
        event.new ?? "",
        matches
      );
      return injectFPEMatchesIntoChanges(adjustedMatches, changes_);
    } catch {
      // Unable to adjust field matches to be relative to complete string
    }

    return changes_;
  }, []);

  return (
    <Stack sx={{ position: "relative" }} spacing={-1}>
      {!!event.old && (
        <StringJsonField
          title="Old Value"
          field="old"
          value={event.old}
          shouldHighlight={(c) => !!c.removed || !!c.redacted}
          changes={oldChanges}
          uniqueId={uniqueId}
        />
      )}
      {!!event.new && (
        <StringJsonField
          title="New Value"
          field="new"
          value={event.new}
          shouldHighlight={(c) => !!c.added || !!c.redacted}
          changes={newChanges}
          uniqueId={uniqueId}
        />
      )}
    </Stack>
  );
};

export default OldNewFields;
