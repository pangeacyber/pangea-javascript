import { FC, useState, useEffect } from "react";
import { Box, IconButton, Menu, Stack, Tooltip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DownloadIcon from "@mui/icons-material/Download";

import { ObjectStore } from "../../types";

import DownloadingIcon from "@mui/icons-material/Downloading";
import ReplayIcon from "@mui/icons-material/Replay";

import { useStoreFileViewerContext } from "../../hooks/context";
import { parseErrorFromPangea } from "../../utils";
import DeleteFileButton from "../DeleteFileButton";
import RenameFileIconButton from "../UpdateFileButton/RenameFileIconButton";

interface VaultItemOptionsProps {
  data: ObjectStore.ObjectResponse;
}

const DownloadFileOptions: FC<VaultItemOptionsProps> = ({ data }) => {
  const theme = useTheme();
  const { apiRef } = useStoreFileViewerContext();

  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownloadFile = () => {
    if (downloading || !data.id || !apiRef.get) return;
    setDownloading(true);

    if (data.type === "folder" && !!apiRef.getArchive) {
      return apiRef
        .getArchive({
          ids: [data.id],
          format: "zip",
          transfer_method: "dest-url",
        })
        .then((response) => {
          setDownloading(false);
          if (response.status === "Success" && !!response.result.dest_url) {
            setError(null);
            const location = response.result.dest_url;
            if (location) {
              window.open(location, "_blank");
            }
          }
        })
        .catch((err) => {
          setError(parseErrorFromPangea(err));
          setDownloading(false);
        });
    }

    return apiRef
      .get({ id: data.id, transfer_method: "dest-url" })
      .then((response) => {
        setDownloading(false);
        if (response.status === "Success") {
          setError(null);
          const location = response.result.dest_url;
          if (location) {
            window.open(location, "_blank");
          }
        }
      })
      .catch((err) => {
        setError(parseErrorFromPangea(err));
        setDownloading(false);
      });
  };

  if (!data.id) return null;
  return (
    <Stack direction="row" spacing={0.5} alignItems="center">
      {!!apiRef?.update && <RenameFileIconButton object={data} />}
      {!!apiRef?.delete && <DeleteFileButton object={data} view="icon" />}
      <Tooltip title={error}>
        <IconButton onClick={handleDownloadFile}>
          {downloading ? (
            <DownloadingIcon sx={{ color: theme.palette.text.primary }} />
          ) : (
            <DownloadIcon
              color={!!error ? "error" : undefined}
              sx={{ color: theme.palette.text.primary }}
            />
          )}
        </IconButton>
      </Tooltip>
    </Stack>
  );
};

export default DownloadFileOptions;
