import { FC } from "react";
import {
  Box,
  Breadcrumbs,
  Button,
  Typography,
  IconButton,
  Select,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import HomeIcon from "@mui/icons-material/Home";

import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import {
  useStoreFileViewerBuckets,
  useStoreFileViewerFolder,
} from "../../hooks/context";

interface Props {}

const BucketOption: FC<{ folder: string; onClick: () => void }> = ({
  folder,
  onClick,
}) => {
  return (
    <Button
      variant="text"
      size="small"
      sx={{ minWidth: "fit-content", textTransform: "none" }}
      onClick={onClick}
    >
      <Typography variant="subtitle2" color="textPrimary">
        {folder}
      </Typography>
    </Button>
  );
};

const BucketSelector: FC<Props> = () => {
  const theme = useTheme();
  const { bucketId, buckets, setBucketId } = useStoreFileViewerBuckets();

  if (!buckets.length) return null;
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
        value={bucketId || "-"}
        onChange={(event) => {
          const value = event.target.value;
          if (value === "-") {
            setBucketId(undefined);
            return;
          }

          setBucketId(value);
        }}
      >
        <MenuItem value={"-"}>
          <Typography variant="body2">Default</Typography>
        </MenuItem>
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
