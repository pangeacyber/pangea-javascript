import { FC, useState } from "react";
import { Box, IconButton, Menu } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteFileButton from "../DeleteFileButton";
import { ObjectStore } from "../../types";
import UpdateFileButton from "../UpdateFileButton";

interface VaultItemOptionsProps {
  object: ObjectStore.ObjectResponse;
  onClose: () => void;
}

const FileOptions: FC<VaultItemOptionsProps> = ({ object, onClose }) => {
  const theme = useTheme();
  const [optionsEl, setOptionsEl] = useState<HTMLElement | null>(null);

  if (!object.id) return null;
  return (
    <Box sx={{ marginLeft: "auto" }}>
      <IconButton
        onClick={(event) => setOptionsEl(event.currentTarget)}
        data-testid="VaultItem-Options-Btn"
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        open={!!optionsEl}
        anchorEl={optionsEl}
        onClose={() => setOptionsEl(null)}
        sx={{
          ".MuiList-root": {
            width: "200px",
          },
          button: {
            justifyContent: "start",
            paddingLeft: 2,
          },
          ".MuiButton-textPrimary": {
            color: theme.palette.text.secondary,
          },
        }}
      >
        <UpdateFileButton object={object} onClose={onClose} />
        <DeleteFileButton object={object} onClose={onClose} />
      </Menu>
    </Box>
  );
};

export default FileOptions;
