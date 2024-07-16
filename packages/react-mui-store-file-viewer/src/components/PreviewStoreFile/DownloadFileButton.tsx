import { Button, ButtonProps } from "@mui/material";
import { FC, useState } from "react";

import DownloadIcon from "@mui/icons-material/Download";
import { ObjectStore } from "../../types";
import { downloadFile } from "../../utils/file";
import { useStoreFileViewerContext } from "../../hooks/context";
import { parseErrorFromPangea } from "../../utils";

interface Props {
  object: ObjectStore.ObjectResponse;
  ButtonProps?: ButtonProps;
}

const DownloadFileButton: FC<Props> = ({ object, ButtonProps }) => {
  const { apiRef } = useStoreFileViewerContext();

  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <Button
      variant="text"
      sx={{ width: "100%" }}
      {...ButtonProps}
      startIcon={<DownloadIcon fontSize="small" />}
      disabled={downloading}
      onClick={handleDownloadFile}
      fullWidth
    >
      {downloading ? "Downloading..." : "Download"}
    </Button>
  );
};

export default DownloadFileButton;
