import { Button, ButtonProps } from "@mui/material";
import { FC, useEffect, useMemo, useRef, useState } from "react";

import FileOpenIcon from "@mui/icons-material/FileOpen";
import { useStoreFileViewerContext } from "../../hooks/context";
import { ObjectStore } from "../../types";
import { createMultipartUploadForm } from "../../utils/file";

interface Props {
  ButtonProps?: ButtonProps;
  onClose: () => void;
}

const CreateNewFileButton: FC<Props> = ({ ButtonProps, onClose }) => {
  const { apiRef, reload, parent } = useStoreFileViewerContext();

  const inputRef = useRef<HTMLInputElement | undefined>();
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const obj = useMemo<ObjectStore.FolderCreateRequest>(() => {
    return {
      name: "",
      path: "/",
    };
  }, []);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  const handleCreateFile = async (
    files: FileList,
    body: ObjectStore.PutRequest
  ) => {
    if (!apiRef.upload || !files) return;

    setLoading(true);
    return apiRef
      .upload(createMultipartUploadForm(files, body), "multipart/form-data")
      .then(() => {
        setLoading(false);
        handleClose();
        return reload();
      })
      .catch((error) => {
        setLoading(false);
        handleClose();
      });
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
            handleCreateFile(e.target.files, {
              name: e.target.files[0].name ?? "Unknown",
              ...(!!parent && {
                parent_id: parent.id,
              }),
            });
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
