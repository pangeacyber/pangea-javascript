import { FC, useState } from "react";
import { Box, Button, Menu, Paper, Typography, MenuItem } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useStoreFileViewerContext } from "../../hooks/context";

interface Props {
  selected: string[];
  contextMenu: {
    mouseX: number;
    mouseY: number;
  } | null;
  setContextMenu: (
    el: {
      mouseX: number;
      mouseY: number;
    } | null
  ) => void;
}

const MultiSelectMenu: FC<Props> = ({
  selected,
  contextMenu,
  setContextMenu,
}) => {
  const theme = useTheme();

  const [downloading, setDownloading] = useState(false);
  const { apiRef } = useStoreFileViewerContext();

  const handleClick = () => {
    setContextMenu(null);
  };

  const handleDownload = () => {
    if (!selected.length || !apiRef?.getArchive) return;
    setDownloading(true);
    apiRef
      .getArchive({
        ids: selected,
        format: "zip",
        transfer_method: "dest-url",
      })
      .then((response) => {
        if (response.status === "Success") {
          const location = response.result.dest_url;
          if (location) {
            window.open(location, "_blank");
          }
        }
      })
      .finally(() => {
        setDownloading(false);
      });
  };

  if (!apiRef.getArchive || !selected.length) return null;
  return (
    <>
      <Menu
        open={contextMenu !== null}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
        onClose={() => setContextMenu(null)}
        sx={{
          width: `250px`,
        }}
        PaperProps={{
          sx: {
            width: `250px`,
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
          <MenuItem sx={{ cursor: "auto" }}>
            <Typography variant="body2" color="textSecondary">
              {selected.length} Selected
            </Typography>
          </MenuItem>
          <Button
            variant="text"
            onClick={handleDownload}
            disabled={downloading}
            sx={{
              color: theme.palette.text.secondary,
              width: "100%",
              paddingLeft: 2,
              justifyContent: "start",
            }}
          >
            Download ZIP
          </Button>
        </Paper>
      </Menu>
    </>
  );
};

export default MultiSelectMenu;
