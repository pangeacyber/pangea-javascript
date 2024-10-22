import { FC } from "react";
import { ObjectStore } from "../../types";
import { Stack, Tooltip, Typography, useTheme } from "@mui/material";

import {
  getDateDisplayName,
  getShareDisplayIcon,
  getShareDisplayName,
  getShareTooltip,
} from "./utils";
import ShareOptions from "./ShareOptions";

interface Props {
  object: ObjectStore.ShareObjectResponse;
  onDelete?: () => void;
}

const ShareObject: FC<Props> = ({ object, onDelete }) => {
  const theme = useTheme();
  const remainingViews =
    object?.max_access_count || 0 - (object.access_count ?? 0);

  const LinkIcon = getShareDisplayIcon(object);
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      gap={1}
    >
      <Stack direction="row" alignItems="center" gap={1}>
        <Tooltip
          title={getShareTooltip(object)}
          componentsProps={{
            tooltip: {
              sx: {
                paddingY: 1,
                paddingX: 1.5,
              },
            },
          }}
        >
          <Stack
            alignItems="center"
            justifyContent="center"
            width="36px"
            height="36px"
            sx={{
              borderRadius: "50%",
              backgroundColor: theme.palette.grey[100],
            }}
          >
            <LinkIcon
              fontSize="small"
              sx={{
                color: theme.palette.text.primary,
              }}
            />
          </Stack>
        </Tooltip>
        <Stack>
          <Typography
            variant="body2"
            sx={{
              width: "290px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {getShareDisplayName(object)}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {remainingViews} view{remainingViews === 1 ? "" : "s"} until{" "}
            {getDateDisplayName(object.expires_at)}
          </Typography>
        </Stack>
      </Stack>
      <Stack justifySelf="end" marginLeft="auto" direction="row">
        <ShareOptions object={object} onDelete={onDelete} />
      </Stack>
    </Stack>
  );
};

export default ShareObject;
