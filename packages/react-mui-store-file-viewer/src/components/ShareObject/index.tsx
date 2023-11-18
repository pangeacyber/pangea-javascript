import { FC, useState } from "react";
import { ObjectStore } from "../../types";
import { IconButton, Stack, Typography } from "@mui/material";

import CheckIcon from "@mui/icons-material/Check";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { getDateDisplayName, getShareDisplayName } from "./utils";

import SendIcon from "@mui/icons-material/Send";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { useStoreFileViewerContext } from "../../hooks/context";

import { CopyButton } from "@pangeacyber/react-mui-shared";

interface Props {
  object: ObjectStore.ShareObjectResponse;
  onDelete?: () => void;
}

const ShareObject: FC<Props> = ({ object, onDelete }) => {
  const { apiRef } = useStoreFileViewerContext();

  const [updating, setUpdating] = useState(false);

  const handleRemove = () => {
    if (!object?.id || !apiRef?.share?.delete) return;

    setUpdating(true);
    apiRef.share
      .delete({
        id: object.id,
      })
      .finally(() => {
        if (onDelete) onDelete();
        setUpdating(false);
      });
  };

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      {object?.sent ?? true ? (
        <CheckIcon color="success" />
      ) : (
        <InfoOutlinedIcon color="info" />
      )}
      <Stack spacing={0} width="100%">
        <Typography variant="body2">{getShareDisplayName(object)}</Typography>
        {!!object.expires_at && (
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="body2" color="textSecondary">
              Expires at:
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {getDateDisplayName(object.expires_at)}
            </Typography>
          </Stack>
        )}
        {!!object.access_count ||
          (!!object.max_access_count && (
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="body2" color="textSecondary">
                Remaining access count:
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {object.max_access_count - (object.access_count ?? 0)}
              </Typography>
            </Stack>
          ))}
        {!!object.last_accessed_at && (
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="body2" color="textSecondary">
              Last accessed at:
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {getDateDisplayName(object.last_accessed_at)}
            </Typography>
          </Stack>
        )}
      </Stack>
      <Stack justifySelf="end" marginLeft="auto" direction="row" spacing={-0.8}>
        <IconButton size="small" data-testid={`Send-Share-${object.id}-Btn`}>
          <SendIcon color="action" fontSize="small" />
        </IconButton>
        {!!object.link && (
          <CopyButton
            value={object.link}
            label={getShareDisplayName(object)}
            size="small"
          />
        )}
        <IconButton
          size="small"
          disabled={updating}
          data-testid={`Remove-Share-${object.id}-Btn`}
          onClick={handleRemove}
        >
          <RemoveCircleOutlineIcon color="error" fontSize="small" />
        </IconButton>
      </Stack>
    </Stack>
  );
};

export default ShareObject;
