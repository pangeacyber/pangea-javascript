import { FC } from "react";
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
  return (
    <>
      {!!object?.presigned_url && (
        <a href={object.presigned_url} download={object.name ?? object.id}>
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
        data={object}
        LabelPropDefaults={{
          color: "secondary",
        }}
      />
    </>
  );
};

export default StoreFileDetails;
