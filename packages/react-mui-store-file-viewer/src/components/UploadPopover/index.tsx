import { useTheme, lighten } from "@mui/material/styles";
import mapValues from "lodash/mapValues";
import Box from "@mui/material/Box";
import Popper from "@mui/material/Popper";
import Fade from "@mui/material/Fade";
import {
  Button,
  CircularProgress,
  Collapse,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { FC, useEffect, useMemo, useState } from "react";

import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import ErrorIcon from "@mui/icons-material/Error";

import {
  FileUpload,
  UploadPopoverStore,
  setUploadState,
  useUploadPopover,
} from "./hooks";
import StoreObjectIcon from "../StoreObjectIcon";
import { createMultipartUploadForm } from "../../utils/file";
import { useStoreFileViewerContext } from "../../hooks/context";
import { parseErrorFromPangea } from "../../utils";
import { PangeaModal } from "@pangeacyber/react-mui-shared";
import { ObjectStore } from "../../types";

export default function UploadPopover() {
  const theme = useTheme();

  const { apiRef, reload, parent } = useStoreFileViewerContext();
  const uploads = useUploadPopover((state) => state.uploads);

  const [conflict, setConflict] = useState<
    | {
        id: string;
        upload: FileUpload;
        folder: ObjectStore.ObjectResponse | undefined;
        name: string;
        state: "replace" | "rename";
      }
    | undefined
  >(undefined);

  const [open, setOpen] = useState(false);
  const [collaspabled, setCollaspabled] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen((previousOpen) => !previousOpen);
  };

  const canBeOpen = open && Boolean(anchorEl);
  const id = canBeOpen ? "transition-popper" : undefined;

  const handleCreateFile = async (
    id: string,
    name: string | undefined = undefined
  ) => {
    const upload = uploads[id];
    if (!apiRef.upload || !upload.file) return;

    setUploadState(id, "uploading");
    return apiRef
      .upload(
        createMultipartUploadForm(upload.file, {
          ...(!!(parent || upload.parent) && {
            parent_id: upload.parent?.id ?? parent?.id,
          }),
          name: name ?? upload.file.name ?? "unknown",
        }),
        "multipart/form-data"
      )
      .then(() => {
        setUploadState(id, "uploaded");
        reload();
      })
      .catch((error) => {
        setUploadState(id, "error", parseErrorFromPangea(error));
        if (
          error?.response?.data?.status === "ObjectStorePutObjectExists" &&
          !conflict &&
          !!apiRef?.delete
        ) {
          setConflict({
            id,
            upload,
            folder: upload.parent ?? parent,
            name: name ?? upload.file.name ?? "unknown",
            state: "replace",
          });
        }
      });
  };

  const handleConflictUpload = async () => {
    setConflict(undefined);
    if (conflict === undefined) return;
    if (conflict?.state === "replace" && apiRef?.delete) {
      await apiRef
        .delete({
          path: `${conflict.folder?.name ?? ""}/${
            conflict?.upload?.file?.name ?? "unknown"
          }`,
        })
        .then(() => {
          reload();
          return handleCreateFile(conflict.id);
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      return handleCreateFile(conflict.id, conflict.name);
    }
  };

  useEffect(() => {
    const uploadIds = Object.keys(uploads);

    const waiting = uploadIds.filter((id) => {
      if (uploads[id].state === "waiting") {
        handleCreateFile(id);
        return true;
      }

      return false;
    });

    if (waiting.length) {
      setOpen(true);
    }
  }, [uploads]);

  const uploading = Object.values(uploads).filter(
    (u) => u.state === "uploading" || u.state === "waiting"
  );
  return (
    <div>
      <Popper
        id={id}
        open={open}
        style={{
          position: "fixed",
          bottom: 0,
          right: 16,
          top: "unset",
          left: "unset",
        }}
        transition
      >
        {({ TransitionProps }) => (
          <Collapse {...TransitionProps} timeout={350}>
            <Box
              sx={{
                border: 1,
                p: 1,
                boxShadow: "0px 0px 24px rgba(40, 48, 94, 0.12)",
                borderRadius: "8px 8px 0px 0px",
                borderBottom: "none",
                borderColor: lighten(theme.palette.secondary.dark, 0.5),
                bgcolor: "background.paper",
                width: "400px",
              }}
            >
              <Stack width="100%">
                <Stack
                  direction="row"
                  width="100%"
                  alignItems="center"
                  justifyContent="space-between"
                  padding={1}
                  paddingTop={0}
                >
                  <Typography>
                    {uploading.length ? "Uploading" : "Uploads"}
                  </Typography>
                  <Stack direction="row" spacing="1">
                    <IconButton
                      size="small"
                      onClick={() => setCollaspabled(!collaspabled)}
                    >
                      {collaspabled ? (
                        <ExpandLessIcon
                          sx={{ color: theme.palette.text.primary }}
                          fontSize="small"
                        />
                      ) : (
                        <ExpandMoreIcon
                          sx={{ color: theme.palette.text.primary }}
                          fontSize="small"
                        />
                      )}
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => {
                        useUploadPopover.setState({ uploads: {} });
                        setOpen(false);
                      }}
                    >
                      <CloseIcon
                        sx={{ color: theme.palette.text.primary }}
                        fontSize="small"
                      />
                    </IconButton>
                  </Stack>
                </Stack>
                <Collapse in={!collaspabled}>
                  <Stack spacing={1} sx={{ marginLeft: -1, marginRight: -1 }}>
                    {!!Object.keys(uploads).length && (
                      <Stack
                        direction="row"
                        sx={{
                          padding: 1,
                          bgcolor: lighten(theme.palette.info.light, 0.8),
                        }}
                      >
                        <Typography variant="body2">
                          {
                            Object.values(uploads).filter(
                              (u) => u.state === "uploaded"
                            ).length
                          }{" "}
                          of {Object.values(uploads).length} uploaded
                        </Typography>
                      </Stack>
                    )}
                    <Stack padding={1} paddingTop={0} spacing={1}>
                      {Object.values(uploads).map((upload, idx) => {
                        const mimeType =
                          (upload.file.name ?? "").split(".").at(-1) ?? "";

                        return (
                          <Stack
                            key={`file-drop-${idx}`}
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            width="100%"
                          >
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                              sx={{
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                              }}
                            >
                              <StoreObjectIcon type={""} mimeType={mimeType} />
                              <Typography
                                color={
                                  upload.state === "uploaded"
                                    ? undefined
                                    : "textSecondary"
                                }
                                variant="body2"
                              >
                                {upload.file.name}
                              </Typography>
                            </Stack>
                            <Box sx={{ paddingRight: 1, paddingLeft: 1 }}>
                              {(upload.state === "waiting" ||
                                upload.state === "uploading") && (
                                <CircularProgress size="16px" color="info" />
                              )}
                              {upload.state === "uploaded" && (
                                <CheckCircleIcon
                                  fontSize="small"
                                  color="success"
                                />
                              )}
                              {upload.state === "error" && (
                                <Tooltip
                                  title={
                                    upload.message ?? "Failed to upload file"
                                  }
                                >
                                  <ErrorIcon fontSize="small" color="error" />
                                </Tooltip>
                              )}
                            </Box>
                          </Stack>
                        );
                      })}
                    </Stack>
                  </Stack>
                </Collapse>
              </Stack>
            </Box>
          </Collapse>
        )}
      </Popper>
      <PangeaModal
        open={!!conflict}
        onClose={() => setConflict(undefined)}
        title={"File name conflict"}
        size="small"
      >
        <Stack spacing={2}>
          <Typography variant="body2">
            {conflict?.upload?.file.name ?? "unknown"} already exists in this
            location. Do you want to replace the existing file with a new file
            or cancel upload? Replacing the file will change sharing settings.
          </Typography>
          <RadioGroup
            aria-labelledby="conflicting-file-options"
            defaultValue="replace"
            name="radio-buttons-group"
            value={conflict?.state ?? "replace"}
            onChange={(e) => {
              const value: any = e.target.value;
              setConflict((state) =>
                !!state
                  ? {
                      ...state,
                      state: value ?? "replace",
                    }
                  : undefined
              );
            }}
          >
            <FormControlLabel
              value="replace"
              control={<Radio />}
              label="Replace existing file"
            />
            <FormControlLabel
              value="rename"
              control={<Radio />}
              label="Rename file"
            />
          </RadioGroup>
          {conflict?.state === "rename" && (
            <TextField
              value={conflict?.name ?? ""}
              placeholder="Add new file name"
              onChange={(e) => {
                let value = e.target.value;
                setConflict((state) =>
                  !!state
                    ? {
                        ...state,
                        name: value,
                      }
                    : undefined
                );

                e.stopPropagation();
              }}
              label="Name"
              size="small"
            />
          )}

          <Stack
            spacing={1}
            direction="row"
            alignItems="center"
            justifyContent="end"
          >
            <Button
              variant="text"
              onClick={() => {
                setConflict(undefined);
              }}
            >
              Cancel
            </Button>
            <Button variant="contained" onClick={handleConflictUpload}>
              Upload
            </Button>
          </Stack>
        </Stack>
      </PangeaModal>
    </div>
  );
}
