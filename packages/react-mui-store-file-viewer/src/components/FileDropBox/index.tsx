import { Box, Stack, Typography, LinearProgress } from "@mui/material";
import { SxProps, useTheme, lighten } from "@mui/material/styles";

import React, { FC, useMemo, useRef, useState } from "react";
import { ObjectStore } from "../../types";
import { useStoreFileViewerContext } from "../../hooks/context";
import { createMultipartUploadForm } from "../../utils/file";

import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";

interface Props {
  children?: React.ReactNode;
  BoxSx?: SxProps;
}

const FileDropBox: FC<Props> = ({ children, BoxSx }) => {
  const theme = useTheme();
  const { apiRef, reload, parent } = useStoreFileViewerContext();

  const isVisibleOnHoverOnly = !!children;

  const drop = useRef<any>(null);
  const drag = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement | undefined>();

  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);

  const body = useMemo<ObjectStore.PutRequest>(() => {
    return {
      name: "unknown",
    };
  }, []);

  const handleCreateFile = async (files: FileList) => {
    if (!apiRef.upload || !files) return;
    setDragging(false);

    setLoading(true);
    return apiRef
      .upload(
        createMultipartUploadForm(files, {
          ...body,
          ...(!!parent && { parent_id: parent.id }),
          name: files[0].name ?? body.name,
        }),
        "multipart/form-data"
      )
      .then(() => {
        setLoading(false);
        reload();
      })
      .catch((error) => {
        setLoading(false);
      });
  };

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

  const handleDragOver = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    const { files } = e.dataTransfer;

    if (files && files.length) {
      handleCreateFile(files);
    }
  };

  const handleDragEnter = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.target !== drag.current) {
      setDragging(true);
    }
  };

  const handleDragLeave = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.target === drag.current) {
      setDragging(false);
    }
  };

  const main = theme.palette.info.main;
  const light = loading
    ? theme.palette.secondary.light
    : theme.palette.info.light;

  return (
    <>
      {!isVisibleOnHoverOnly && (
        <input
          // @ts-ignore
          ref={inputRef}
          style={{ display: "none" }}
          type="file"
          onChange={(e) => {
            if (e.target.files) {
              handleCreateFile(e.target.files);
            }
          }}
        />
      )}
      <Box
        ref={drop}
        sx={{
          position: "relative",
          ...(!isVisibleOnHoverOnly && {
            cursor: "pointer",
            border: `2px solid ${main}`,
            borderStyle: "dashed",
            width: "100%",
            height: "150px",
          }),
          ":hover": {
            cursor: "pointer",
            border: `2px dashed solid ${main}`,
            borderStyle: "dashed",
          },
          ...BoxSx,
        }}
        onClick={(e) => {
          if (isVisibleOnHoverOnly || loading) return;

          e.stopPropagation();
          e.preventDefault();
          inputRef.current?.click();
        }}
      >
        {dragging && (
          <Box
            ref={drag}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: "100%",
              height: "100%",
            }}
          ></Box>
        )}
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
      </Box>
    </>
  );
};

export default FileDropBox;
