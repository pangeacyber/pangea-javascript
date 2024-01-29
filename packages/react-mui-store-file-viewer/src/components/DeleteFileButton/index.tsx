import { PangeaDeleteModal } from "@pangeacyber/react-mui-shared";
import { FC } from "react";
import { ObjectStore } from "../../types";
import { Button, ButtonProps, IconButton } from "@mui/material";
import { useTheme } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { useStoreFileViewerContext } from "../../hooks/context";
import { alertOnError } from "../AlertSnackbar/hooks";

interface Props {
  object: ObjectStore.ObjectResponse;
  view?: "text" | "icon";
  ButtonProps?: ButtonProps;
  onClose?: () => void;
}

const DeleteFileButton: FC<Props> = ({
  object,
  ButtonProps,
  onClose = () => {},
  view = "text",
}) => {
  const theme = useTheme();
  const { apiRef, reload } = useStoreFileViewerContext();

  return (
    <PangeaDeleteModal
      description={`${
        object.name || object.id
      } and all versions will be permanently removed from the secure file store.`}
      title={`Delete ${object.name || object.id}`}
      onDelete={async () => {
        if (!apiRef.delete) return;

        return apiRef
          .delete({ id: object.id, force: true })
          .then(() => {
            onClose();
            reload();
          })
          .catch((err) => {
            alertOnError(err);
            reload();
            onClose();
          });
      }}
      Button={(props) =>
        view === "icon" ? (
          <IconButton onClick={props.onClick}>
            <DeleteIcon
              fontSize="small"
              sx={{ color: theme.palette.text.primary }}
            />
          </IconButton>
        ) : (
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
        )
      }
    />
  );
};

export default DeleteFileButton;
