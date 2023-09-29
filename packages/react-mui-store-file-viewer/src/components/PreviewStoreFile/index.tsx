import { FC, useEffect, useState } from "react";

import CloseIcon from "@mui/icons-material/Close";
import { Stack, Typography, IconButton, Divider } from "@mui/material";

import { PreviewSessionFields } from "./fields";
import { ObjectStore } from "../../types";
import { FieldsPreview } from "@pangeacyber/react-mui-shared";
import FileOptions from "../FileOptions";
import { useStoreFileViewerContext } from "../../hooks/context";

interface PreviewFileProps {
  data: ObjectStore.ObjectResponse;
  onClose: () => void;
}

const PreviewStoreFile: FC<PreviewFileProps> = ({ data, onClose }) => {
  const { apiRef } = useStoreFileViewerContext();
  const [object, setObject] = useState<ObjectStore.ObjectResponse>(data);

  useEffect(() => {
    if (!data.id || !apiRef.get) return;

    apiRef.get({ id: data.id }).then((response) => {
      if (response.status === "Success") {
        setObject(response.result.object);
      }
    });
  }, [data.id]);

  return (
    <Stack
      width="350px"
      padding={1}
      spacing={1}
      paddingLeft={2}
      paddingRight={2}
      data-testid="Preview-Panel"
      height="100%"
    >
      <Stack direction="row" alignItems="center">
        <Typography
          variant="h5"
          sx={{ overflow: "hidden", wordBreak: "break-all" }}
        >
          {object.name}
        </Typography>
        <Stack
          direction="row"
          alignItems="center"
          sx={{ marginLeft: "auto!important" }}
          spacing={1}
        >
          <FileOptions object={object} onClose={onClose} />
          <IconButton onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>
      <Divider
        sx={{ marginLeft: "-16px!important", marginRight: "-16px!important" }}
      />
      <Typography variant="h6">Details</Typography>
      <FieldsPreview
        schema={PreviewSessionFields}
        data={object}
        LabelPropDefaults={{
          color: "secondary",
        }}
      />
    </Stack>
  );
};

export default PreviewStoreFile;
