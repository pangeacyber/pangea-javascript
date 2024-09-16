import { Box, Button, ButtonProps } from "@mui/material";
import { FC, useEffect, useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import { ObjectStore } from "../../../types";
import { ShareCreateProvider } from "../../../hooks/context";
import CreateShareModal from "./CreateShareModal";
import CopyPasswordModal from "./CopyPasswordModal";

interface Props {
  object: ObjectStore.ObjectResponse;
  shareType?: string; // email | link
  ButtonProps?: ButtonProps;
  onClose: (password?: string) => void;
  onDone: () => void;
}

const CreateSharesButton: FC<Props> = ({
  object,
  shareType = "email",
  ButtonProps,
  onClose,
  onDone,
}) => {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");

  const handleClose = (password?: string) => {
    setOpen(false);
    if (!!password) {
      setPassword(password);
    }
    onClose();
  };

  const handlePasswordClose = () => {
    setPassword("");
  };

  return (
    <>
      <Button
        variant="text"
        {...ButtonProps}
        startIcon={<AddIcon fontSize="small" />}
        data-testid="New-Share-Btn"
        onClick={() => setOpen(true)}
      >
        {ButtonProps?.children || "Share via Email"}
      </Button>
      <ShareCreateProvider
        contentType={object?.type ?? "file"}
        shareType={shareType}
      >
        <CreateShareModal
          object={object}
          open={open}
          onClose={handleClose}
          onDone={onDone}
        />
        <CopyPasswordModal
          password={password}
          open={!!password}
          onClose={handlePasswordClose}
        />
      </ShareCreateProvider>
    </>
  );
};

export default CreateSharesButton;
