import { PangeaDeleteModal } from "@pangeacyber/react-mui-shared";
import { FC } from "react";
import { ObjectStore } from "../../types";
import { Button, ButtonProps } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { useStoreFileViewerContext } from "../../hooks/context";

interface Props {
  object: ObjectStore.ObjectResponse;
  ButtonProps?: ButtonProps;
  onClose: () => void;
}

const DeleteFileButton: FC<Props> = ({ object, ButtonProps, onClose }) => {
  const { apiRef, reload } = useStoreFileViewerContext();

  return (
    <PangeaDeleteModal
      description={`${
        object.name || object.id
      } and all versions will be permanently removed from the Vault`}
      title={`Delete ${object.name || object.id}`}
      onDelete={async () => {
        if (!apiRef.delete) return;

        return apiRef.delete({ id: object.id }).then(() => {
          onClose();
          reload();
        });
      }}
      Button={(props) => (
        <Button
          sx={{ width: "100%" }}
          color="error"
          variant="text"
          startIcon={<DeleteIcon fontSize="small" />}
          onClick={props.onClick}
          {...ButtonProps}
        >
          Delete
        </Button>
      )}
    />
  );
};

export default DeleteFileButton;
