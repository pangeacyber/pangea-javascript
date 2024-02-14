import { FC, useMemo, useState } from "react";
import { ObjectStore } from "../../types";
import { Button, ButtonProps, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import { useStoreFileViewerContext } from "../../hooks/context";
import { alertOnError } from "../AlertSnackbar/hooks";
import { FieldsForm, PangeaModal } from "@pangeacyber/react-mui-shared";
import { getCreateProtectedFileFields } from "../CreateNewProtectedFileButton/fields";

interface Props {
  object: ObjectStore.ObjectResponse;
  ButtonProps?: ButtonProps;
  onClose?: () => void;
}

const AddFilePasswordButton: FC<Props> = ({
  object,
  ButtonProps,
  onClose = () => {},
}) => {
  const theme = useTheme();
  const { apiRef, reload, configurations } = useStoreFileViewerContext();

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  const fields = useMemo(() => {
    return getCreateProtectedFileFields({
      policy: configurations?.passwordPolicy ?? {
        chars_min: 8,
      },
    });
  }, [configurations]);

  return (
    <>
      <Button
        sx={{ width: "100%" }}
        variant="text"
        startIcon={<LockOutlinedIcon fontSize="small" />}
        onClick={() => setOpen(true)}
        {...ButtonProps}
      >
        Add password
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
            object={object}
            fields={fields}
            clearable
            onCancel={handleClose}
            onSubmit={async (values: Partial<ObjectStore.PutRequest>) => {
              if (!apiRef.update) return;

              return apiRef
                .update({
                  id: object.id,
                  add_password: values.password,
                  add_password_algorithm: "AES-CFB-256",
                })
                .then(() => {
                  handleClose();
                  reload();
                })
                .catch((err) => {
                  alertOnError(err);
                });
            }}
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

export default AddFilePasswordButton;
