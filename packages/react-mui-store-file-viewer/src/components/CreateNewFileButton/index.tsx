import { Button, ButtonProps } from "@mui/material";
import { FC, useEffect, useMemo, useRef, useState } from "react";

import FileOpenIcon from "@mui/icons-material/FileOpen";
import { useStoreFileViewerContext } from "../../hooks/context";
import { ObjectStore } from "../../types";
import { createMultipartUploadForm } from "../../utils/file";
import { uploadFiles } from "../UploadPopover/hooks";

interface Props {
  ButtonProps?: ButtonProps;
  onClose: () => void;
}

const CreateNewFileButton: FC<Props> = ({ ButtonProps, onClose }) => {
  const { apiRef, reload, parent } = useStoreFileViewerContext();

  const inputRef = useRef<HTMLInputElement | undefined>();
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  return (
    <>
      <input
        // @ts-ignore
        ref={inputRef}
        style={{ display: "none" }}
        type="file"
        onChange={(e) => {
          if (e.target.files) {
            uploadFiles(e.target.files);
            handleClose();
          }
        }}
      />
      <Button
        variant="text"
        disabled={loading}
        {...ButtonProps}
        startIcon={<FileOpenIcon fontSize="small" />}
        onClick={() => inputRef.current?.click()}
      >
        File
      </Button>
    </>
  );
};

export default CreateNewFileButton;
