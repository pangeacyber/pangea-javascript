import { FC, SyntheticEvent, useEffect, useState } from "react";

import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import {
  Stack,
  Typography,
  IconButton,
  Divider,
  Button,
  Tabs,
  Tab,
} from "@mui/material";

import { PreviewSessionFields } from "./fields";
import { ObjectStore } from "../../types";
import { FieldsPreview } from "@pangeacyber/react-mui-shared";
import FileOptions from "../FileOptions";
import { useStoreFileViewerContext } from "../../hooks/context";
import StoreFileDetails from "./StoreFileDetails";
import StoreFileSharing from "./StoreFileSharing";
import { PREVIEW_FILE_WIDTH } from "./constants";

interface PreviewFileProps {
  data: ObjectStore.ObjectResponse;
  onClose: () => void;
}

const PreviewStoreFile: FC<PreviewFileProps> = ({ data, onClose }) => {
  const { apiRef } = useStoreFileViewerContext();

  const [currentTab, setCurrentTab] = useState("sharing");

  const handleTabChange = (event: SyntheticEvent, newTabId: string) => {
    setCurrentTab(newTabId);
  };

  const [object, setObject] = useState<ObjectStore.ObjectResponse>(data);

  useEffect(() => {
    if (!data.id || !apiRef.get) return;

    apiRef
      .get({ id: data.id, transfer_method: "dest-url" })
      .then((response) => {
        if (response.status === "Success") {
          setObject({
            ...response.result.object,
            ...(response.result?.dest_url && {
              dest_url: response.result?.dest_url,
            }),
          });
        }
      });
  }, [data.id]);

  return (
    <Stack
      width={`${PREVIEW_FILE_WIDTH}px`}
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
      <Tabs value={currentTab} onChange={handleTabChange}>
        <Tab
          value="details"
          id="details"
          label="Details"
          sx={{ width: "50%", minHeight: "50px" }}
        />
        <Tab
          value="sharing"
          id="sharing"
          label="Sharing"
          sx={{ width: "50%", minHeight: "50px" }}
        />
      </Tabs>
      {currentTab === "details" && (
        <StoreFileDetails object={object} onClose={onClose} />
      )}
      {currentTab === "sharing" && (
        <StoreFileSharing object={object} onClose={onClose} />
      )}
    </Stack>
  );
};

export default PreviewStoreFile;
