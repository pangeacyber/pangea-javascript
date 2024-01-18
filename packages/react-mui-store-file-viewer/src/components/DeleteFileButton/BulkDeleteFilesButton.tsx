import { PangeaDeleteModal } from "@pangeacyber/react-mui-shared";
import { FC } from "react";
import { ObjectStore } from "../../types";
import { Button, ButtonProps, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { useStoreFileViewerContext } from "../../hooks/context";

interface Props {
  selected: string[];
  view?: "text" | "icon";
  ButtonProps?: ButtonProps;
  onClose?: () => void;
}

const BulkDeleteFilesButton: FC<Props> = ({
  selected,
  ButtonProps,
  onClose = () => {},
  view = "text",
}) => {
  const { apiRef, reload } = useStoreFileViewerContext();

  return (
    <PangeaDeleteModal
      description={`Are you sure you wish to delete the ${selected.length} selected along with all versions which will be permanently removed from the secure file store?`}
      title={`Delete ${selected.length} selected`}
      onDelete={async () => {
        if (!apiRef.delete) return;

        return Promise.all([
          selected.map(
            (id) => !!apiRef.delete && apiRef.delete({ id, force: true })
          ),
        ])
          .then(() => {})
          .finally(() => {
            onClose();
            reload();

            setTimeout(() => {
              // Add a delayed reload as the first reloading may still return items that were just deleted..
              reload();
            }, 1500);
          });
      }}
      Button={(props) =>
        view === "icon" ? (
          <IconButton onClick={props.onClick}>
            <DeleteIcon fontSize="small" color="error" />
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

export default BulkDeleteFilesButton;
