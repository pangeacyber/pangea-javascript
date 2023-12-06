import { FC, useMemo, useState, useEffect } from "react";
import { ObjectStore } from "../../types";
import { Button, Typography } from "@mui/material";
import { FieldsPreview } from "@pangeacyber/react-mui-shared";
import { PreviewSessionFields } from "./fields";

import DownloadIcon from "@mui/icons-material/Download";
import { useStoreFileViewerContext } from "../../hooks/context";

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

  useEffect(() => {
    if (object.id && object.type === "folder" && !!apiRef?.getArchive) {
      apiRef
        .getArchive({
          ids: [object.id],
          format: "zip",
          transfer_method: "dest-url",
        })
        .then((response) => {
          if (response.status === "Success") {
            setArchive(response.result);
          }
        });
    }
  }, [object]);

  return (
    <>
      {!!object?.dest_url && (
        <a href={object.dest_url} download={object.name ?? object.id}>
          <Button
            sx={{ width: "100%" }}
            color="primary"
            startIcon={<DownloadIcon fontSize="small" />}
            variant="outlined"
            fullWidth
          >
            Download
          </Button>
        </a>
      )}
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
