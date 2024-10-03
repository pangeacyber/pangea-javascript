import { Button, ButtonProps, Stack, Typography } from "@mui/material";
import { FC, useMemo, useRef, useState } from "react";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import { useFileViewerContext } from "../../hooks/context";
import { ObjectStore } from "../../types";
import { uploadFiles } from "../UploadPopover/hooks";
import { FieldsForm, PangeaModal } from "@pangeacyber/react-mui-shared";
import { getCreateProtectedFileFields } from "./fields";

interface Props {
  ButtonProps?: ButtonProps;
  onClose: () => void;
}

const CreateNewProtectedFileButton: FC<Props> = ({ ButtonProps, onClose }) => {
  const { apiRef, reload, parent, configurations } = useFileViewerContext();

  const inputRef = useRef<HTMLInputElement | undefined>();

  const [files, setFiles] = useState<FileList | undefined>();
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setFiles(undefined);
    setOpen(false);
    onClose();
  };

  const handleUpload = async (body: Partial<ObjectStore.PutRequest>) => {
    if (!files) return;

    uploadFiles(files, undefined, body);
    handleClose();
  };

  const obj = useMemo<Partial<ObjectStore.PutRequest>>(() => {
    return {};
  }, []);

  const fields = useMemo(() => {
    return getCreateProtectedFileFields({
      policy: configurations?.passwordPolicy ?? {
        chars_min: 8,
      },
    });
  }, [configurations]);

  return (
    <>
      <input
        // @ts-ignore
        ref={inputRef}
        style={{ display: "none" }}
        type="file"
        onChange={(e) => {
          if (e.target.files) {
            setFiles(e.target.files);
            setOpen(true);
          }
        }}
      />
      <Button
        variant="text"
        disabled={loading}
        {...ButtonProps}
        startIcon={<LockOutlinedIcon fontSize="small" />}
        onClick={() => inputRef.current?.click()}
      >
        Password protected file
      </Button>
      <PangeaModal
        open={open}
        onClose={handleClose}
        displayCloseIcon
        title=""
        header={
          <Stack>
            <Stack
              direction="row"
              width="100%"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography
                variant="h5"
                sx={{ overflow: "hidden", wordBreak: "break-all" }}
              >
                {`Protect using password`}
              </Typography>
            </Stack>
            <Typography variant="body2" color="textSecondary">
              Requires a password to decrypt before downloading.
            </Typography>
          </Stack>
        }
        size="medium"
      >
        <>
          <FieldsForm
            object={obj}
            fields={fields}
            clearable
            onCancel={handleClose}
            onSubmit={(values: Partial<ObjectStore.PutRequest>) => {
              return handleUpload({
                password: values.password ?? "",
                password_algorithm: "AES-CFB-256",
              }).finally(handleClose);
            }}
            disabled={loading}
            StackSx={{
              ".MuiFormControl-root": {
                margin: 0,
              },
            }}
          />
        </>
      </PangeaModal>
    </>
  );
};

export default CreateNewProtectedFileButton;
