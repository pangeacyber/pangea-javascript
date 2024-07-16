import { FC, useMemo } from "react";
import find from "lodash/find";
import { Typography, Select, MenuItem, Tooltip } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { useStoreFileViewerBuckets } from "../../hooks/context";

interface Props {}

const BucketSelector: FC<Props> = () => {
  const { bucketId, buckets, setBucketId } = useStoreFileViewerBuckets();

  const defaultBucketId = useMemo(() => {
    return find(buckets, (bucket) => !!bucket.default)?.id;
  }, [buckets]);

  if (!buckets.length || buckets.length === 1) return null;
  return (
    <Tooltip title="Select which storage bucket to view" placement="top">
      <Select
        variant="standard"
        size="medium"
        color="primary"
        sx={{
          ".MuiSelect-select": {
            paddingTop: "8px",
            paddingLeft: "0px",
          },
          ":before": {
            border: "none!important",
          },
          ":after": {
            border: "none",
          },
        }}
        value={bucketId || defaultBucketId || "-"}
        onChange={(event) => {
          const value = event.target.value;
          if (value === "-") {
            setBucketId(undefined);
            return;
          }

          setBucketId(value);
        }}
      >
        {!defaultBucketId && (
          <MenuItem value={"-"}>
            <Typography variant="body2">Default bucket</Typography>
          </MenuItem>
        )}
        {buckets.map((bucket, idx) => {
          return (
            <MenuItem
              key={`bucket-option-${bucket.id}-${idx}`}
              value={bucket.id}
            >
              <Typography variant="body2">
                {bucket.name || bucket.id}
              </Typography>
            </MenuItem>
          );
        })}
      </Select>
    </Tooltip>
  );
};

export default BucketSelector;
