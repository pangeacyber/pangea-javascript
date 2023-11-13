import { FC } from "react";
import { ObjectStore } from "../../types";
import { IconButton, Stack, Typography } from "@mui/material";

import CheckIcon from "@mui/icons-material/Check";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { getDateDisplayName, getShareDisplayName } from "./utils";

import SendIcon from "@mui/icons-material/Send";

interface Props {
  object: ObjectStore.ShareObjectResponse;
}

const ShareObject: FC<Props> = ({ object }) => {
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
      <Stack justifySelf="end" marginLeft="auto" direction="row" spacing={1}>
        {/* <CopyButton /> */}
        <IconButton data-testid={`Send-Share-${object.id}-Btn`} disabled>
          <SendIcon color="action" fontSize="small" />
        </IconButton>
      </Stack>
    </Stack>
  );
};

export default ShareObject;
