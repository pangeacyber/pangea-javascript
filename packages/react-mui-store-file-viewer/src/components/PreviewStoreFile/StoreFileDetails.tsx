import { FC, useMemo } from "react";
import { ObjectStore } from "../../types";
import { Button, Typography } from "@mui/material";
import { FieldsPreview } from "@pangeacyber/react-mui-shared";
import { PreviewSessionFields } from "./fields";

import DownloadIcon from "@mui/icons-material/Download";

interface Props {
  object: ObjectStore.ObjectResponse;
  onClose: () => void;
}

const StoreFileDetails: FC<Props> = ({ object, onClose }) => {
  const obj = useMemo(() => {
    return {
      ...object,
      ...object?.metadata_protected,
    };
  }, [object]);

  return (
    <>
      {!!object?.location && (
        <a href={object.location} download={object.name ?? object.id}>
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
