import { Button, ButtonProps } from "@mui/material";
import { FC, useMemo, useState } from "react";
import pickBy from "lodash/pickBy";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { FieldsForm, PangeaModal } from "@pangeacyber/react-mui-shared";
import { getUpdateFields } from "./fields";
import { useStoreFileViewerContext } from "../../hooks/context";
import { ObjectStore } from "../../types";

interface Props {
  object: ObjectStore.ObjectResponse;
  ButtonProps?: ButtonProps;
  onClose: () => void;
}

export const UpdateAPIFields = new Set([
  "id",
  "name",
  "parent_id",
  "tags",
  "metadata",
]);

const UpdateFileButton: FC<Props> = ({ object, ButtonProps, onClose }) => {
  const { apiRef, reload } = useStoreFileViewerContext();
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  const fields = useMemo(() => {
    return getUpdateFields({ apiRef });
  }, [apiRef]);

  const handleUpdate = async (body: ObjectStore.UpdateRequest) => {
    if (!apiRef.update) return;

    setLoading(true);

    return (
      apiRef
        // @ts-ignore
        .update(pickBy(body, (v, k) => UpdateAPIFields.has(k)))
        .then(() => {
          handleClose();
          setLoading(false);
          reload();
        })
        .catch((error) => {
          setLoading(false);
        })
    );
  };

  if (!object.id) return null;
  return (
    <>
      <Button
        variant="text"
        sx={{ width: "100%" }}
        {...ButtonProps}
        startIcon={<EditOutlinedIcon fontSize="small" />}
        onClick={() => setOpen(true)}
      >
        Edit
      </Button>
      <PangeaModal
        open={open}
        onClose={handleClose}
        title={"Edit"}
        size="small"
      >
        <FieldsForm
          object={object}
          fields={fields}
          onSubmit={(values) => {
            if (values.parent_id === "/") {
              values.parent_id = "";
            }

            return handleUpdate(
              // @ts-ignore
              pickBy(values, (v, k) => !!v || k === "parent_id")
            );
          }}
          disabled={loading}
        />
      </PangeaModal>
    </>
  );
};

export default UpdateFileButton;
