import { Button, ButtonProps } from "@mui/material";
import { FC, useMemo, useState, useEffect } from "react";
import pickBy from "lodash/pickBy";

import FolderIcon from "@mui/icons-material/Folder";
import { FieldsForm, PangeaModal } from "@pangeacyber/react-mui-shared";
import { getCreateFolderFields } from "./fields";
import { useStoreFileViewerContext } from "../../hooks/context";
import { ObjectStore } from "../../types";

interface Props {
  ButtonProps?: ButtonProps;
  onClose: () => void;
}

const CreateNewFolderButton: FC<Props> = ({ ButtonProps, onClose }) => {
  const { apiRef, reload, parent } = useStoreFileViewerContext();
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const [obj, setObj] = useState<ObjectStore.FolderCreateRequest>({
    name: "",
    parent_id: parent?.id ?? "/",
  });

  useEffect(() => {
    setObj({
      name: "",
      parent_id: parent?.id ?? "/",
    });
  }, [open]);

  const fields = useMemo(() => {
    return getCreateFolderFields({ apiRef });
  }, []);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  const handleCreateFolder = async (body: ObjectStore.FolderCreateRequest) => {
    if (!apiRef.folderCreate) return;

    setLoading(true);
    return (
      apiRef
        // @ts-ignore
        .folderCreate(pickBy(body, (v, k) => k !== "path"))
        .then(() => {
          setLoading(false);
          reload();
        })
        .catch((error) => {
          setLoading(false);
        })
    );
  };

  return (
    <>
      <Button
        variant="text"
        {...ButtonProps}
        startIcon={<FolderIcon fontSize="small" />}
        onClick={() => setOpen(true)}
      >
        Folder
      </Button>
      <PangeaModal
        open={open}
        onClose={handleClose}
        title={"Create Folder"}
        size="small"
      >
        <FieldsForm
          object={obj}
          fields={fields}
          onSubmit={(values) => {
            if (values.parent_id === "/") {
              values.parent_id = "";
            }

            // @ts-ignore
            return handleCreateFolder(pickBy(values, (v) => !!v)).finally(
              handleClose
            );
          }}
          disabled={loading}
        />
      </PangeaModal>
    </>
  );
};

export default CreateNewFolderButton;
