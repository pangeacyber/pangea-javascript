import { Box, Button, IconButton, Menu } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { FC, useState } from "react";
import { ObjectStore } from "../../types";

interface SessionOptionProps {
  object: ObjectStore.ObjectResponse;
  onClose: () => void;
}

const StoreFileOptions: FC<SessionOptionProps> = ({ object, onClose }) => {
  const theme = useTheme();
  const [optionsEl, setOptionsEl] = useState<HTMLElement | null>(null);

  if (!object.id) return null;
  return (
    <Box sx={{ marginLeft: "auto" }}>
      <IconButton onClick={(event) => setOptionsEl(event.currentTarget)}>
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
      ></Menu>
    </Box>
  );
};

export default StoreFileOptions;
