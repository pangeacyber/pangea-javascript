import { FC, useState } from "react";
import { IconButton, Stack, Tooltip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DownloadIcon from "@mui/icons-material/Download";

import { ObjectStore } from "../../types";

import DownloadingIcon from "@mui/icons-material/Downloading";

import { useFileViewerContext } from "../../hooks/context";
import { parseErrorFromPangea } from "../../utils";
import DeleteFileButton from "../DeleteFileButton";
import RenameFileIconButton from "../UpdateFileButton/RenameFileIconButton";
import { downloadFile } from "../../utils/file";

interface VaultItemOptionsProps {
  data: ObjectStore.ObjectResponse;
}

const DownloadFileOptions: FC<VaultItemOptionsProps> = ({ data }) => {
  const theme = useTheme();
  const { apiRef } = useFileViewerContext();

  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownloadFile = () => {
    if (downloading) return;
    setDownloading(true);

    return downloadFile(data, apiRef)
      .then(() => {
        setDownloading(false);
        setError(null);
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
