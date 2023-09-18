import { FC, useState } from "react";
import isEmpty from "lodash/isEmpty";

import { Stack, Typography, Switch } from "@mui/material";

import { Audit } from "../../types";
import { useDiffWords } from "../../hooks/diff";

import StringJsonField from "../AuditStringJsonField";

interface Props {
  event: {
    old: string;
    new: string;
  };
  direction: "row" | "column";
  uniqueId: string;
}

const OldNewFields: FC<Props> = ({ event, direction, uniqueId }) => {
  const [showDiff, setShowDiff] = useState(true);
  const changes = useDiffWords(event.old, event.new);

  const shouldShowDiffs = showDiff && !isEmpty(changes);

  return (
    <Stack sx={{ position: "relative" }} spacing={-1}>
      {!isEmpty(changes) && false && (
        <Stack
          direction="row"
          spacing={1}
          marginLeft="auto"
          paddingRight={2}
          sx={{
            alignItems: "center",
          }}
        >
          <Typography color="textSecondary" variant="body2">
            {showDiff ? "Hide differences" : "Show differences"}
          </Typography>
          <Switch
            checked={showDiff}
            color="info"
            onClick={() => setShowDiff(!showDiff)}
          />
        </Stack>
      )}
      {!!event.old && (
        <StringJsonField
          title="Old Value"
          field="old"
          value={event.old}
          shouldHighlight={(c) => !!c.removed}
          changes={shouldShowDiffs ? changes.filter((c) => !c.added) : []}
          uniqueId={uniqueId}
        />
      )}
      {!!event.new && (
        <StringJsonField
          title="New Value"
          field="old"
          value={event.new}
          shouldHighlight={(c) => !!c.added}
          changes={shouldShowDiffs ? changes.filter((c) => !c.removed) : []}
          uniqueId={uniqueId}
        />
      )}
    </Stack>
  );
};

export default OldNewFields;
