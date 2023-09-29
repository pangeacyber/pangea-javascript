import { FC } from "react";
import { Box, Breadcrumbs, Button, Typography } from "@mui/material";

import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useStoreFileViewerFolder } from "../../hooks/context";

interface Props {}

const FolderOption: FC<{ folder: string; onClick: () => void }> = ({
  folder,
  onClick,
}) => {
  return (
    <Button
      variant="text"
      size="small"
      sx={{ minWidth: "fit-content" }}
      onClick={onClick}
    >
      <Typography variant="subtitle2" color="textPrimary">
        {folder}
      </Typography>
    </Button>
  );
};

const FolderPath: FC<Props> = () => {
  const { folder, setFolder, setParentId } = useStoreFileViewerFolder();
  const folders = folder.split("/").filter((f) => !!f);

  return (
    <Box sx={{ paddingBottom: 1, marginLeft: -0.5 }}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        <FolderOption folder="Root" onClick={() => setParentId("")} />
        {folders.map((f, idx) => {
          return (
            <FolderOption
              key={`folder-${idx}`}
              folder={f}
              onClick={() => {
                // FIXME: This won't work without path working
                // setFolder("/" + folders.slice(0, idx + 1).join("/"));
              }}
            />
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};

export default FolderPath;
