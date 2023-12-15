import { FC, useState } from "react";
import { Box, Button, Menu, Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";

import CreateSharesViaPasswordButton from "./CreateSharesViaPasswordButton";
import { ObjectStore } from "../../types";
import { PREVIEW_FILE_WIDTH } from "../PreviewStoreFile/constants";
import CreateSharesViaEmailButton from "./CreateSharesViaEmailButton";
import CreateSharesViaSmsButton from "./CreateSharesViaSmsButton";

interface Props {
  object: ObjectStore.ObjectResponse;
  onDone: () => void;
}

const CreateNewShareButton: FC<Props> = ({ object, onDone }) => {
  const theme = useTheme();
  const [optionsEl, setOptionsEl] = useState<HTMLElement | null>(null);

  const handleClick = () => {
    setOptionsEl(null);
  };

  return (
    <Box>
      <Button
        startIcon={<AddIcon fontSize="small" />}
        variant="contained"
        color="primary"
        onClick={(event) => setOptionsEl(event.currentTarget)}
        data-testid="New-Share-Btn"
        sx={{ width: "100%" }}
        fullWidth
      >
        Share-Link
      </Button>
      <Menu
        open={!!optionsEl}
        anchorEl={optionsEl}
        onClose={() => setOptionsEl(null)}
        sx={{
          width: `${PREVIEW_FILE_WIDTH}px`,
        }}
        PaperProps={{
          sx: {
            width: `${PREVIEW_FILE_WIDTH}px`,
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
        >
          <CreateSharesViaEmailButton
            ButtonProps={{
              sx: {
                color: theme.palette.text.secondary,
                width: "100%",
                paddingLeft: 2,
                justifyContent: "start",
              },
              // @ts-ignore
              "data-testid": "New-Share-Email-Btn",
            }}
            onClose={handleClick}
            object={object}
            onDone={onDone}
          />
          <CreateSharesViaSmsButton
            ButtonProps={{
              sx: {
                color: theme.palette.text.secondary,
                width: "100%",
                paddingLeft: 2,
                justifyContent: "start",
              },
              // @ts-ignore
              "data-testid": "New-Share-Phone-Btn",
            }}
            onClose={handleClick}
            object={object}
            onDone={onDone}
          />
          <CreateSharesViaPasswordButton
            ButtonProps={{
              sx: {
                color: theme.palette.text.secondary,
                width: "100%",
                paddingLeft: 2,
                justifyContent: "start",
              },
              // @ts-ignore
              "data-testid": "New-Share-Password-Btn",
            }}
            onClose={handleClick}
            object={object}
            onDone={onDone}
          />
        </Paper>
      </Menu>
    </Box>
  );
};

export default CreateNewShareButton;
