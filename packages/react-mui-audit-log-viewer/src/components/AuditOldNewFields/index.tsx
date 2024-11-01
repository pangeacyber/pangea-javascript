import { FC, useMemo } from "react";

import { Stack } from "@mui/material";

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
  oldField?: { title: string };
  newField?: { title: string };

  direction: "row" | "column";
  uniqueId: string;
  context?: FPEContext;
}

const OldNewFields: FC<Props> = ({
  event,
  direction,
  uniqueId,
  context,
  oldField,
  newField,
}) => {
  const changes = useDiffWords(event.old, event.new);

  console.log(changes);

  const oldChanges = useMemo(() => {
    const matches = getFieldMatches("old", context);
    const changes_ = changes.filter((c) => !c.added);

    console.log(matches);

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
          title={oldField?.title ?? "Old"}
          field="old"
          value={event.old}
          shouldHighlight={(c) => !!c.removed || !!c.redacted}
          changes={oldChanges}
          uniqueId={uniqueId}
        />
      )}
      {!!event.new && (
        <StringJsonField
          title={newField?.title ?? "New"}
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
