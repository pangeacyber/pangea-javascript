import { FC, useMemo, useState, useEffect } from "react";
import { ObjectStore } from "../../types";
import { Button, Typography } from "@mui/material";
import { FieldsPreview } from "@pangeacyber/react-mui-shared";
import { PreviewSessionFields } from "./fields";

import DownloadIcon from "@mui/icons-material/Download";
import { useStoreFileViewerContext } from "../../hooks/context";
import { alertOnError } from "../AlertSnackbar/hooks";
import { downloadFile } from "../../utils/file";
import { parseErrorFromPangea } from "../../utils";

interface Props {
  object: ObjectStore.ObjectResponse;
  onClose: () => void;
}

const StoreFileDetails: FC<Props> = ({ object, onClose }) => {
  const { apiRef } = useStoreFileViewerContext();

  const [archive, setArchive] = useState<
    ObjectStore.GetArchiveResponse | undefined
  >();

  const obj = useMemo(() => {
    return {
      ...object,
      ...object?.metadata_protected,
      ...(!!archive?.dest_url && {
        dest_url: archive?.dest_url,
      }),
    };
  }, [object, archive]);

  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownloadFile = () => {
    if (downloading) return;
    setDownloading(true);

    return downloadFile(obj, apiRef)
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
    <>
      <Button
        sx={{ width: "100%" }}
        color="primary"
        startIcon={<DownloadIcon fontSize="small" />}
        disabled={downloading}
        onClick={handleDownloadFile}
        variant="outlined"
        fullWidth
      >
        {downloading ? "Downloading..." : "Download"}
      </Button>
      <Typography variant="h6">Details</Typography>
      <FieldsPreview
        schema={PreviewSessionFields}
        data={obj}
        LabelPropDefaults={{
          color: "secondary",
        }}
      />
    </>
  );
};

export default StoreFileDetails;
