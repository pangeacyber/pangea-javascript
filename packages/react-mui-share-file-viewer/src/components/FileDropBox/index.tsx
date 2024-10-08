import {
  Box,
  Stack,
  Typography,
  LinearProgress,
  Skeleton,
  Button,
} from "@mui/material";
import { SxProps, useTheme } from "@mui/material/styles";
import find from "lodash/find";

import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import { useFileViewerContext } from "../../hooks/context";

import AddIcon from "@mui/icons-material/Add";

import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import { uploadFiles, useUploadPopover } from "../UploadPopover/hooks";
import TargetPopper from "./TargetPopper";

interface Props {
  children?: React.ReactNode;
  BoxSx?: SxProps;
}

const FileDropBox: FC<Props> = ({ children, BoxSx }) => {
  const theme = useTheme();
  const { parent, data, loading } = useFileViewerContext();
  const objects = useRef(data?.objects ?? []);
  objects.current = data?.objects ?? [];

  const [targetParent, setTargetParent] = useState(parent);
  const parentRef = useRef(targetParent);
  parentRef.current = targetParent;

  useEffect(() => {
    setTargetParent(parent);
  }, [parent]);

  const drop = useRef<any>(null);
  const exit = useRef<any>(null);

  const isMissingData = !loading && !parent && !data.objects.length;

  const inputRef = useRef<HTMLInputElement | undefined>();

  const [dragging, setDragging] = useState(false);

  React.useEffect(() => {
    drop.current?.addEventListener("dragover", handleDragOver);
    drop.current?.addEventListener("drop", handleDrop);
    drop.current?.addEventListener("dragenter", handleDragEnter);
    drop.current?.addEventListener("dragleave", handleDragLeave);

    return () => {
      drop.current?.removeEventListener("dragover", handleDragOver);
      drop.current?.removeEventListener("drop", handleDrop);
      drop.current?.removeEventListener("dragenter", handleDragEnter);
      drop.current?.removeEventListener("dragleave", handleDragLeave);
    };
  }, []);

  const updateTarget = (element: any) => {
    if (element.getAttribute("data-field") === "name") {
      const row = element.parentElement;
      if (row) {
        const objectId = row.getAttribute("data-id");
        if (objectId) {
          const object = find(objects.current, (o) => o.id === objectId);
          if (object && object.type === "folder") {
            setTargetParent(object);
            return true;
          }
        }
      }
    }

    return false;
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    if (exit.current) {
      clearTimeout(exit.current);
      exit.current = null;
    }
    setDragging(true);

    if (e.target.getAttribute("data-field") === "name") {
      if (!updateTarget(e.target)) {
        setTargetParent(parent);
      }
    } else {
      const cell = e.target.closest(".MuiDataGrid-Cell");
      if (cell && updateTarget(cell)) {
        // Do nothing, parent is targetted
      } else {
        setTargetParent(parent);
      }
    }
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    const { files } = e.dataTransfer;

    if (files && files.length) {
      uploadFiles(files, parentRef.current);
    }
    setDragging(false);
  };

  const handleDragEnter = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    if (!exit.current) {
      exit.current = setTimeout(() => {
        setDragging(false);
      }, 200);
    }
  };

  const main = theme.palette.info.main;
  return (
    <>
      {
        <input
          // @ts-ignore
          ref={inputRef}
          style={{ display: "none" }}
          type="file"
          onChange={(e) => {
            if (e.target.files) {
              uploadFiles(e.target.files);
            }
          }}
        />
      }
      <Stack
        ref={drop}
        direction="row"
        sx={{
          position: "relative",
          width: "100%",
          border: `2px solid transparent`,
          ...(!!dragging && {
            cursor: "pointer",
            border: `2px solid ${main}`,
          }),
          ...BoxSx,
        }}
      >
        {isMissingData ? (
          <Stack spacing={-1} width="100%" height="100%" overflow="hidden">
            <Skeleton height="50px" />
            <Skeleton height="50px" />
            <Skeleton height="50px" />
            <Skeleton height="50px" />
            <Skeleton height="50px" />
            <Skeleton height="50px" />
            <Skeleton height="50px" />
            <Skeleton height="50px" />
            <Skeleton height="50px" />
            <Box
              sx={{
                position: "absolute",
                top: "calc(50% - 40px)",
                bottom: "16px",
                left: "calc(50% - 100px)",
              }}
            >
              <Stack
                spacing={2}
                sx={{ maxWidth: "210px", textAlign: "center" }}
                alignItems="center"
              >
                <Typography variant="body2">
                  <span style={{ fontWeight: "bold" }}>Drag and drop</span>{" "}
                  files or click the button to upload
                </Typography>
                <Button
                  startIcon={<AddIcon fontSize="small" />}
                  size="small"
                  variant="contained"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    inputRef.current?.click();
                  }}
                >
                  Upload
                </Button>
              </Stack>
            </Box>
          </Stack>
        ) : (
          <>
            {children ?? (
              <Stack
                gap={1}
                width="100%"
                height="100%"
                paddingY={6}
                alignItems="center"
                justifyContent="center"
              >
                <FileUploadOutlinedIcon sx={{ fontSize: "40px" }} />
                {!loading && dragging && (
                  <Typography variant="body2">Drop files to upload</Typography>
                )}
                {!loading && !dragging && (
                  <>
                    <Typography variant="body2">
                      Drag files here to upload
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: theme.palette.info.main }}
                    >
                      or choose a file
                    </Typography>
                  </>
                )}
                {loading && (
                  <LinearProgress
                    color="info"
                    sx={{ height: "2px", width: "100%", maxWidth: "200px" }}
                  />
                )}
              </Stack>
            )}
          </>
        )}
        <TargetPopper open={dragging} parent={targetParent} />
      </Stack>
    </>
  );
};

export default FileDropBox;
