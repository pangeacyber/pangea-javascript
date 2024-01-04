import { FC, useState, useEffect } from "react";
import {
  Box,
  Button,
  Menu,
  Paper,
  Typography,
  MenuItem,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useStoreFileViewerContext } from "../../hooks/context";
import { ObjectStore } from "../../types";
import DownloadIcon from "@mui/icons-material/Download";
import CreateSharesViaPasswordButton from "../CreateNewShareButton/CreateSharesViaPasswordButton";
import CreateSharesViaSmsButton from "../CreateNewShareButton/CreateSharesViaSmsButton";
import CreateSharesViaEmailButton from "../CreateNewShareButton/CreateSharesViaEmailButton";

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

  const [objects, setObjects] = useState<ObjectStore.ObjectResponse[]>([]);

  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const { apiRef } = useStoreFileViewerContext();

  const handleDownload = () => {
    if (selected.length === 1) {
      if (
        objects.length === 1 &&
        objects[0]?.type !== ObjectStore.ObjectType.Folder &&
        objects[0]?.dest_url
      ) {
        const location = objects[0].dest_url;
        window.open(location, "_blank");
        return;
      }
    }

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

  useEffect(() => {
    if (contextMenu !== null && selected.length === 1 && apiRef?.get) {
      setLoading(true);
      apiRef
        .get({
          id: selected[0],
          transfer_method: "dest-url",
        })
        .then((response) => {
          if (response.status === "Success") {
            setObjects([
              {
                ...response.result.object,
                dest_url: response.result.dest_url,
              },
            ]);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setObjects([]);
    }
  }, [contextMenu, selected]);

  const handleDone = () => {
    setContextMenu(null);
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
          width: `350px`,
        }}
        PaperProps={{
          sx: {
            width: `350px`,
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
          <Box sx={{ cursor: "auto", padding: 1, paddingX: 2 }}>
            <Typography variant="body2" color="textSecondary">
              {selected.length} Selected
            </Typography>
          </Box>
          {selected.length === 1 ? (
            <>
              <Button
                variant="text"
                onClick={handleDownload}
                disabled={downloading || loading}
                sx={{
                  color: theme.palette.text.primary,
                  width: "100%",
                  paddingLeft: 2,
                  justifyContent: "start",
                }}
                startIcon={<DownloadIcon fontSize="small" />}
              >
                Download
              </Button>
              {!!apiRef?.share?.create && objects.length === 1 && (
                <>
                  <Divider />
                  <CreateSharesViaEmailButton
                    ButtonProps={{
                      sx: {
                        color: theme.palette.text.primary,
                        width: "100%",
                        paddingLeft: 2,
                        justifyContent: "start",
                      },
                      // @ts-ignore
                      "data-testid": "New-Share-Email-Btn",
                      children: "Share via emails",
                    }}
                    onClose={handleDone}
                    object={objects[0]}
                    onDone={handleDone}
                  />
                  <CreateSharesViaSmsButton
                    ButtonProps={{
                      sx: {
                        color: theme.palette.text.primary,
                        width: "100%",
                        paddingLeft: 2,
                        justifyContent: "start",
                      },
                      // @ts-ignore
                      "data-testid": "New-Share-Phone-Btn",
                      children: "Share via phone numbers",
                    }}
                    onClose={handleDone}
                    object={objects[0]}
                    onDone={handleDone}
                  />
                  <CreateSharesViaPasswordButton
                    ButtonProps={{
                      sx: {
                        color: theme.palette.text.primary,
                        width: "100%",
                        paddingLeft: 2,
                        justifyContent: "start",
                      },
                      // @ts-ignore
                      "data-testid": "New-Share-Password-Btn",
                      children: "Share via password",
                    }}
                    onClose={handleDone}
                    object={objects[0]}
                    onDone={handleDone}
                  />
                </>
              )}
            </>
          ) : (
            <Button
              variant="text"
              onClick={handleDownload}
              disabled={downloading}
              startIcon={<DownloadIcon fontSize="small" />}
              sx={{
                color: theme.palette.text.primary,
                width: "100%",
                paddingLeft: 2,
                justifyContent: "start",
              }}
            >
              Download ZIP
            </Button>
          )}
        </Paper>
      </Menu>
    </>
  );
};

export default MultiSelectMenu;
