import { FC, useMemo, useState } from "react";
import { ObjectStore } from "../../types";
import { Typography } from "@mui/material";
import { FieldsPreview } from "@pangeacyber/react-mui-shared";
import { PreviewSessionFields } from "./fields";

interface Props {
  object: ObjectStore.ObjectResponse;
  onClose: () => void;
}

const StoreFileDetails: FC<Props> = ({ object, onClose }) => {
  const [archive, setArchive] = useState<
    ObjectStore.GetArchiveResponse | undefined
  >();

  const obj = useMemo(() => {
    return {
      ...object,
      ...object?.metadata_protected,
      ...(!!archive?.dest_url && {
        dest_url: archive?.dest_url,
      }),
    };
  }, [object, archive]);

  return (
    <>
      <FieldsPreview
        schema={PreviewSessionFields}
        data={obj}
        LabelPropDefaults={{
          color: "secondary",
        }}
      />
    </>
  );
};

export default StoreFileDetails;
