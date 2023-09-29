import { Button, ButtonProps } from "@mui/material";
import { FC, useMemo, useState } from "react";
import pickBy from "lodash/pickBy";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { FieldsForm, PangeaModal } from "@pangeacyber/react-mui-shared";
import { UpdateFields } from "./fields";
import { useStoreFileViewerContext } from "../../hooks/context";
import { ObjectStore } from "../../types";

interface Props {
  object: ObjectStore.ObjectResponse;
  ButtonProps?: ButtonProps;
  onClose: () => void;
}

const UpdateFileButton: FC<Props> = ({ object, ButtonProps, onClose }) => {
  const { apiRef, reload } = useStoreFileViewerContext();
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  const handleUpdate = async (body: ObjectStore.UpdateRequest) => {
    if (!apiRef.update) return;

    setLoading(true);

    return (
      apiRef
        // @ts-ignore
        .update(pickBy(body, (v) => !!v))
        .then(() => {
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
          fields={UpdateFields}
          onSubmit={(values) => {
            // @ts-ignore
            return handleUpdate(pickBy(values, (v) => !!v)).finally(
              handleClose
            );
          }}
          disabled={loading}
        />
      </PangeaModal>
    </>
  );
};

export default UpdateFileButton;
