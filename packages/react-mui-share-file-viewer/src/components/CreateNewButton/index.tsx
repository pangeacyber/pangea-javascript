import { FC, useState } from "react";
import { Box, Button, Menu, Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";

import CreateNewFileButton from "../CreateNewFileButton";
import CreateNewFolderButton from "../CreateNewFolderButton";
import CreateNewProtectedFileButton from "../CreateNewProtectedFileButton";

interface Props {
  hideCreateProtected?: boolean;
  hideFolderOptions?: boolean;
}

const CreateNewButton: FC<Props> = ({
  hideCreateProtected = false,
  hideFolderOptions = false,
}) => {
  const theme = useTheme();
  const [optionsEl, setOptionsEl] = useState<HTMLElement | null>(null);

  const handleClick = () => {
    setOptionsEl(null);
  };

  return (
    <Box sx={{ marginLeft: "auto" }}>
      <Button
        startIcon={<AddIcon fontSize="small" />}
        variant="contained"
        color="secondary"
        onClick={(event) => setOptionsEl(event.currentTarget)}
        data-testid="New-Item-Btn"
      >
        New
      </Button>
      <Menu
        open={!!optionsEl}
        anchorEl={optionsEl}
        onClose={() => setOptionsEl(null)}
        sx={{
          width: "300px",
        }}
        PaperProps={{
          sx: {
            width: "300px",
          },
        }}
      >
        <Paper
          tabIndex={-1}
          onKeyDown={(event) => {
            if (event.key === "Tab") {
              event.stopPropagation();
            }
          }}
          elevation={0}
        >
          <CreateNewFolderButton
            ButtonProps={{
              sx: {
                color: (theme.vars || theme).palette.text.primary,
                width: "100%",
                paddingLeft: 2,
                justifyContent: "start",
              },
              // @ts-ignore
              "data-testid": "New-Folder-Btn",
            }}
            onClose={handleClick}
            hideFolderOptions={hideFolderOptions}
          />
          <CreateNewFileButton
            ButtonProps={{
              sx: {
                color: (theme.vars || theme).palette.text.primary,
                width: "100%",
                paddingLeft: 2,
                justifyContent: "start",
              },
              // @ts-ignore
              "data-testid": "New-File-Btn",
            }}
            onClose={handleClick}
          />
          {!hideCreateProtected && (
            <CreateNewProtectedFileButton
              ButtonProps={{
                sx: {
                  color: (theme.vars || theme).palette.text.primary,
                  width: "100%",
                  paddingLeft: 2,
                  justifyContent: "start",
                },
                // @ts-ignore
                "data-testid": "New-ProtectedFile-Btn",
              }}
              onClose={handleClick}
            />
          )}
        </Paper>
      </Menu>
    </Box>
  );
};

export default CreateNewButton;
