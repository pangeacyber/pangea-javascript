import { FC } from "react";
import {
  Box,
  Breadcrumbs,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import HomeIcon from "@mui/icons-material/Home";

import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useFileViewerFolder } from "../../hooks/context";

interface Props {
  defaultHidden?: boolean;
  virtualRoot?: boolean;
}

const FolderOption: FC<{ folder: string; onClick: () => void }> = ({
  folder,
  onClick,
}) => {
  return (
    <Button
      variant="text"
      size="small"
      sx={{ minWidth: "fit-content", textTransform: "none" }}
      onClick={onClick}
    >
      <Typography variant="subtitle2" color="textPrimary">
        {folder}
      </Typography>
    </Button>
  );
};

const FolderPath: FC<Props> = ({ defaultHidden, virtualRoot }) => {
  const theme = useTheme();
  const { folder, setFolder } = useFileViewerFolder();
  const folders = folder.split("/").filter((f) => !!f);

  if (!!defaultHidden && !folders.length) return null;
  return (
    <Box>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        <IconButton
          onClick={() =>
            setFolder(virtualRoot ? "/" + (folders[0] || "") : "/")
          }
        >
          <HomeIcon
            fontSize="small"
            color="inherit"
            sx={{ color: (theme.vars || theme).palette.text.primary }}
          />
        </IconButton>
        {folders.map((f, idx) => {
          return (
            <FolderOption
              key={`folder-${idx}`}
              folder={f}
              onClick={() => {
                setFolder("/" + folders.slice(0, idx + 1).join("/"));
              }}
            />
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};

export default FolderPath;
