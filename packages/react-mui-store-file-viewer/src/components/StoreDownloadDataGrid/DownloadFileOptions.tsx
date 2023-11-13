import { FC, useState, useEffect } from "react";
import { Box, IconButton, Menu, Stack } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

import { ObjectStore } from "../../types";

import DownloadingIcon from "@mui/icons-material/Downloading";
import { useStoreFileViewerContext } from "../../hooks/context";

interface VaultItemOptionsProps {
  data: ObjectStore.ObjectResponse;
}

const DownloadFileOptions: FC<VaultItemOptionsProps> = ({ data }) => {
  const { apiRef } = useStoreFileViewerContext();
  const [object, setObject] = useState<ObjectStore.ObjectResponse>(data);

  useEffect(() => {
    if (!data.id || !apiRef.get) return;

    apiRef.get({ id: data.id }).then((response) => {
      if (response.status === "Success") {
        setObject({
          ...response.result.object,
          presigned_url: response.result.presigned_url,
        });
      }
    });
  }, [data.id]);

  if (!object.id) return null;
  return (
    <Stack direction="row" spacing={0.5} alignItems="center">
      {!!object?.presigned_url ? (
        <a href={object.presigned_url} download={object.name ?? object.id}>
          <IconButton>
            <DownloadIcon color="success" />
          </IconButton>
        </a>
      ) : (
        <IconButton>
          <DownloadingIcon />
        </IconButton>
      )}
    </Stack>
  );
};

export default DownloadFileOptions;
