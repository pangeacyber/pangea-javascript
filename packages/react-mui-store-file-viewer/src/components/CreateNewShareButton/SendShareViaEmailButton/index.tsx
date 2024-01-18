import { Button, ButtonProps, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Email";
import { FC, useMemo, useState } from "react";

import { ObjectStore } from "../../../types";
import { useStoreFileViewerContext } from "../../../hooks/context";
import SendShareViaEmailModal from "./SendShareViaEmailModal";

interface Props {
  object: ObjectStore.ShareObjectResponse;
  defaultOpen?: boolean;
  Button?: FC<ButtonProps>;
  onClose?: () => void;
  onDone?: () => void;
}

const SendIconButton: FC<ButtonProps> = (props) => {
  return (
    <IconButton size="small" {...props}>
      <SendIcon color="action" fontSize="small" />
    </IconButton>
  );
};

const ConfirmSendButton: FC<ButtonProps> = (props) => {
  // @ts-ignore
  const isSaving = props?.children?.endsWith("...");
  return <Button {...props}>{isSaving ? "Sending..." : "Send"}</Button>;
};

const SendShareViaEmailButton: FC<Props> = ({
  object,
  defaultOpen,
  Button: CustomButton = SendIconButton,
  onClose = () => {},
  onDone = () => {},
}) => {
  const { apiRef } = useStoreFileViewerContext();
  const [open, setOpen] = useState(defaultOpen ?? false);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  const shares = useMemo(() => {
    return [object];
  }, [object]);

  if (!apiRef.share?.send || !object?.id) return null;
  return (
    <>
      {!defaultOpen && (
        <CustomButton
          data-testid={`Send-Share-${object.id}-Btn`}
          onClick={() => {
            setOpen(true);
          }}
        />
      )}
      <SendShareViaEmailModal
        shares={shares}
        open={open}
        onClose={handleClose}
        onDone={onDone}
      />
    </>
  );
};

export default SendShareViaEmailButton;
