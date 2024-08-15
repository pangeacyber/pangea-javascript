import { Box, Button, ButtonProps } from "@mui/material";
import { FC, useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import { ObjectStore } from "../../../types";
import { ShareCreateProvider } from "../../../hooks/context";
import CreateShareModal from "./CreateShareModal";

interface Props {
  object: ObjectStore.ObjectResponse;
  shareType?: string; // email | link
  ButtonProps?: ButtonProps;
  onClose: () => void;
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
  const handleClose = () => {
    setOpen(false);
    onClose();
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
      </ShareCreateProvider>
    </>
  );
};

export default CreateSharesButton;
