import { FC, useState } from "react";
import { Box, IconButton, Menu, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import DownloadIcon from "@mui/icons-material/Download";

import DeleteFileButton from "../DeleteFileButton";
import { ObjectStore } from "../../types";
import UpdateFileButton from "../UpdateFileButton";
import RemoveFilePasswordButton from "../RemoveFilePasswordButton";
import AddFilePasswordButton from "../AddFilePasswordButton";

interface VaultItemOptionsProps {
  object: ObjectStore.ObjectResponse;
  onOpen?: () => void;
  onClose: () => void;
  displayDownloadInline?: boolean;
}

const FileOptions: FC<VaultItemOptionsProps> = ({
  object,
  onOpen,
  onClose,
  displayDownloadInline,
}) => {
  const theme = useTheme();
  const [optionsEl, setOptionsEl] = useState<HTMLElement | null>(null);

  const handleClose = () => {
    setOptionsEl(null);
    onClose();
  };

  if (!object.id) return null;
  return (
    <Stack direction="row" spacing={0.5} alignItems="center">
      {!!displayDownloadInline && !!object?.dest_url && (
        <a href={object.dest_url} download={object.name ?? object.id}>
          <IconButton>
            <DownloadIcon />
          </IconButton>
        </a>
      )}
      <Box sx={{ marginLeft: "auto" }}>
        <IconButton
          onClick={(event) => {
            if (!!onOpen) onOpen();
            setOptionsEl(event.currentTarget);
            event.stopPropagation();
          }}
          data-testid="VaultItem-Options-Btn"
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          open={!!optionsEl}
          anchorEl={optionsEl}
          onClose={() => setOptionsEl(null)}
          sx={{
            ".MuiList-root": {
              width: "200px",
            },
            button: {
              justifyContent: "start",
              paddingLeft: 2,
            },
            ".MuiButton-textPrimary": {
              color: theme.palette.text.primary,
            },
          }}
        >
          {!!object?.["vault-password-algorithm"] ||
          !!object?.metadata_protected?.["vault-password-algorithm"] ? (
            <RemoveFilePasswordButton object={object} onClose={handleClose} />
          ) : (
            <AddFilePasswordButton object={object} onClose={handleClose} />
          )}
          <UpdateFileButton object={object} onClose={handleClose} />
          <DeleteFileButton object={object} onClose={handleClose} />
        </Menu>
      </Box>
    </Stack>
  );
};

export default FileOptions;
