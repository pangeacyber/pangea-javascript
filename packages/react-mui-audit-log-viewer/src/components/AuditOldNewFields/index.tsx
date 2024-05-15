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
  updateMatches,
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
      const adjustedMatches = updateMatches(event.old ?? "", matches);
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
      const adjustedMatches = updateMatches(event.new ?? "", matches);
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
          // How should fpe context get mixed in here?
          // In string changes array has the words broken apart
          // If it was just s & e.. then could do it for character basis..
          // although that would result in a lot of elements (in poor performance)
          //
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
