import { FC, useState, useEffect } from "react";
import { Box, IconButton, Menu, Stack, Tooltip } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

import { ObjectStore } from "../../types";

import DownloadingIcon from "@mui/icons-material/Downloading";
import ReplayIcon from "@mui/icons-material/Replay";

import { useStoreFileViewerContext } from "../../hooks/context";

interface VaultItemOptionsProps {
  data: ObjectStore.ObjectResponse;
}

const DownloadFileOptions: FC<VaultItemOptionsProps> = ({ data }) => {
  const { apiRef } = useStoreFileViewerContext();

  const [hasDownload, setHasDownload] = useState(true);
  const [object, setObject] = useState<ObjectStore.ObjectResponse>(data);

  const handleFetchDownload = () => {
    if (!data.id || !apiRef.get) return;
    setHasDownload(true);

    apiRef
      .get({ id: data.id, transfer_method: "url" })
      .then((response) => {
        if (response.status === "Success") {
          setHasDownload(true);
          setObject({
            ...response.result.object,
            location: response.result.object?.location,
          });
        }
      })
      .catch((err) => {
        setHasDownload(false);
      });

    if (data.type === "folder" && !!apiRef.getArchive) {
      apiRef
        .getArchive({
          ids: [object.id],
          format: "tar",
          transfer_method: "url",
        })
        .then((response) => {
          if (response.status === "Success" && !!response.result.location) {
            setHasDownload(true);
            setObject((state) => ({
              ...state,
              location: response.result.location,
            }));
          }
        })
        .catch((err) => {
          setHasDownload(false);
        });
    }
  };

  useEffect(() => {
    handleFetchDownload();
  }, [data.id]);

  if (!object.id) return null;
  if (!hasDownload) {
    return (
      <Stack direction="row" spacing={0.5} alignItems="center">
        <Tooltip title="Failed retrieving download link">
          <IconButton onClick={handleFetchDownload}>
            <ReplayIcon />
          </IconButton>
        </Tooltip>
      </Stack>
    );
  }
  return (
    <Stack direction="row" spacing={0.5} alignItems="center">
      {!!object?.location ? (
        <a href={object.location} download={object.name ?? object.id}>
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
