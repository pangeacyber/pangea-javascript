import { Button, ButtonProps, IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { FC, useMemo, useState } from "react";
import pickBy from "lodash/pickBy";

import EditIcon from "@mui/icons-material/Edit";

import { FieldsForm, PangeaModal } from "@pangeacyber/react-mui-shared";
import { RenameUpdateFields } from "./fields";
import { useFileViewerContext } from "../../hooks/context";
import { ObjectStore } from "../../types";

interface Props {
  object: ObjectStore.ObjectResponse;
  ButtonProps?: ButtonProps;
  onClose?: () => void;
}

export const RenameAPIFields = new Set(["id", "name"]);

const RenameFileIconButton: FC<Props> = ({
  object,
  ButtonProps,
  onClose = () => {},
}) => {
  const theme = useTheme();
  const { apiRef, reload } = useFileViewerContext();
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  const fields = useMemo(() => {
    return RenameUpdateFields;
  }, [apiRef]);

  const handleUpdate = async (body: ObjectStore.UpdateRequest) => {
    if (!apiRef.update) return;

    setLoading(true);

    const data: ObjectStore.UpdateRequest = {
      id: body.id,
      ...pickBy(body, (v, k) => RenameAPIFields.has(k)),
    };

    return apiRef
      .update(data)
      .then(() => {
        handleClose();
        setLoading(false);
        reload();
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  if (!object.id) return null;
  return (
    <>
      <IconButton {...ButtonProps} onClick={() => setOpen(true)}>
        <EditIcon sx={{ color: theme.palette.text.primary }} />
      </IconButton>
      <PangeaModal
        open={open}
        onClose={handleClose}
        title={"Rename"}
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

export default RenameFileIconButton;
