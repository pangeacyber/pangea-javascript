import { FC, useState } from "react";
import { ObjectStore } from "../../types";
import { Button, ButtonProps } from "@mui/material";
import { useTheme } from "@mui/material";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import { useStoreFileViewerContext } from "../../hooks/context";
import { alertOnError } from "../AlertSnackbar/hooks";
import PasswordConfirmationModal from "../PasswordConfirmationModal";

interface Props {
  object: ObjectStore.ObjectResponse;
  ButtonProps?: ButtonProps;
  onClose?: () => void;
}

const RemoveFilePasswordButton: FC<Props> = ({
  object,
  ButtonProps,
  onClose = () => {},
}) => {
  const theme = useTheme();
  const { apiRef, reload } = useStoreFileViewerContext();

  const [open, setOpen] = useState(false);

  const handleCancel = () => {
    setOpen(false);
    onClose();
  };

  return (
    <>
      <Button
        sx={{ width: "100%" }}
        color="error"
        variant="text"
        startIcon={<LockOutlinedIcon fontSize="small" color="error" />}
        onClick={() => setOpen(true)}
        {...ButtonProps}
      >
        Remove password
      </Button>
      <PasswordConfirmationModal
        open={open}
        onClose={handleCancel}
        description={`Removing the password for ${object.name || object.id}.`}
        title={`Removing password`}
        onContinue={async (password) => {
          if (!apiRef.update) return;

          return apiRef
            .update({ id: object.id, remove_password: password })
            .then(() => {
              handleCancel();
              reload();
            })
            .catch((err) => {
              alertOnError(err);
            });
        }}
      />
    </>
  );
};

export default RemoveFilePasswordButton;
