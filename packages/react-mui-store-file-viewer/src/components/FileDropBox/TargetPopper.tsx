import { useTheme, lighten } from "@mui/material/styles";
import Box from "@mui/material/Box";
import {
  Collapse,
  Stack,
  Typography,
  Popper,
  Fade,
  Button,
} from "@mui/material";
import { FC, useRef } from "react";

import StoreObjectIcon from "../StoreObjectIcon";
import AddIcon from "@mui/icons-material/Add";
import { ObjectStore } from "../../types";

import HomeIcon from "@mui/icons-material/Home";
interface Props {
  open: boolean;
  parent: ObjectStore.ObjectResponse | undefined;
}

const TargetPopper: FC<Props> = ({ open, parent }) => {
  const theme = useTheme();

  return (
    <>
      <Popper
        id={"drop-target-popper"}
        open={open}
        placement="top"
        transition
        disablePortal={true}
        style={{
          position: "absolute",
          top: "unset",
          bottom: "16px",
          left: "calc(50% - 100px)",
          zIndex: 1,
        }}
        popperOptions={{
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [5, 5],
              },
            },
          ],
        }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Stack
              spacing={1}
              sx={{
                border: 0,
                p: 1,
                boxShadow: "0px 0px 24px rgba(40, 48, 94, 0.12)",
                borderRadius: "16px",
                borderColor: lighten(theme.palette.secondary.dark, 0.5),
                bgcolor: lighten(theme.palette.info.light, 0.8),
                width: "200px",
              }}
              alignItems="center"
            >
              <Typography variant="body2">Drop files to upload</Typography>
              {
                <Stack direction="row" alignItems="center" spacing={1}>
                  {!!parent ? (
                    <StoreObjectIcon type={"folder"} mimeType="" />
                  ) : (
                    <HomeIcon />
                  )}
                  {!!parent && <Typography>{parent.name}</Typography>}
                </Stack>
              }
            </Stack>
          </Fade>
        )}
      </Popper>
    </>
  );
};

export default TargetPopper;
