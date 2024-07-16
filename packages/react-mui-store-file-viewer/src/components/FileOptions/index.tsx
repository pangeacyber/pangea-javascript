import { FC, useState } from "react";
import { Box, IconButton, Menu, Paper, Stack, Tooltip } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import DownloadIcon from "@mui/icons-material/Download";
import DownloadingIcon from "@mui/icons-material/Downloading";

import DeleteFileButton from "../DeleteFileButton";
import { ObjectStore } from "../../types";
import UpdateFileButton from "../UpdateFileButton";
import RemoveFilePasswordButton from "../RemoveFilePasswordButton";
import AddFilePasswordButton from "../AddFilePasswordButton";
import { useStoreFileViewerContext } from "../../hooks/context";
import { downloadFile } from "../../utils/file";
import { parseErrorFromPangea } from "../../utils";
import DownloadFileButton from "../PreviewStoreFile/DownloadFileButton";

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
  const { apiRef } = useStoreFileViewerContext();

  const [optionsEl, setOptionsEl] = useState<HTMLElement | null>(null);

  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    setOptionsEl(null);
    onClose();
  };

  const handleDownloadFile = () => {
    if (downloading) return;
    setDownloading(true);

    return downloadFile(object, apiRef)
      .then(() => {
        setDownloading(false);
        setError(null);
      })
      .catch((err) => {
        setError(parseErrorFromPangea(err));
        setDownloading(false);
      });
  };

  if (!object.id) return null;
  return (
    <Stack direction="row" spacing={0.5} alignItems="center">
      {!!displayDownloadInline && (
        <Tooltip title={error}>
          <IconButton onClick={handleDownloadFile}>
            {downloading ? (
              <DownloadingIcon />
            ) : (
              <DownloadIcon color={!!error ? "error" : undefined} />
            )}
          </IconButton>
        </Tooltip>
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
          <Paper
            tabIndex={-1}
            onKeyDown={(event) => {
              if (event.key === "Tab") {
                event.stopPropagation();
              }
            }}
          >
            {!displayDownloadInline && <DownloadFileButton object={object} />}
            {object?.type !== "folder" && (
              <>
                {!!object?.["vault-password-algorithm"] ||
                !!object?.metadata_protected?.["vault-password-algorithm"] ? (
                  <RemoveFilePasswordButton
                    object={object}
                    onClose={handleClose}
                  />
                ) : (
                  <AddFilePasswordButton
                    object={object}
                    onClose={handleClose}
                  />
                )}
              </>
            )}
            <UpdateFileButton object={object} onClose={handleClose} />
            <DeleteFileButton object={object} onClose={handleClose} />
          </Paper>
        </Menu>
      </Box>
    </Stack>
  );
};

export default FileOptions;
