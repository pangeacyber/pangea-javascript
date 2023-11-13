import { Button, ButtonProps } from "@mui/material";
import { FC, useMemo, useState } from "react";
import pickBy from "lodash/pickBy";

import MailOutlineIcon from "@mui/icons-material/MailOutline";

import {
  FieldsForm,
  FieldsFormSchema,
  PangeaModal,
} from "@pangeacyber/react-mui-shared";
import { ObjectStore } from "../../../types";
import { useStoreFileViewerContext } from "../../../hooks/context";
import { CreateEmailShareFields } from "./fields";

interface Props {
  object: ObjectStore.ObjectResponse;
  ButtonProps?: ButtonProps;
  onClose: () => void;
  onDone: () => void;
}

const CreateSharesViaEmailButton: FC<Props> = ({
  object,
  ButtonProps,
  onClose,
  onDone,
}) => {
  const { apiRef } = useStoreFileViewerContext();
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const obj = useMemo<ObjectStore.SingleShareCreateRequest>(() => {
    var date = new Date();
    date.setDate(date.getDate() + 7);

    return {
      targets: [],
      authenticators: [],
      link_type: "download",
      expires_at: date.toISOString(),
      max_access_count: 10,
    };
  }, []);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  const handleCreateShare = async (
    body: ObjectStore.SingleShareCreateRequest
  ) => {
    if (!apiRef.share?.create) return;

    setLoading(true);
    if (!apiRef.share?.create) return;
    return apiRef.share
      .create({
        links: (body?.authenticators ?? [])?.map((auth) => {
          return {
            ...body,
            targets: [object.id],
            authenticators: [auth],
          };
        }),
      })
      .finally(() => {
        setLoading(false);
        onDone();
      });
  };

  const fields = useMemo<
    FieldsFormSchema<ObjectStore.SingleShareCreateRequest>
  >(() => {
    return CreateEmailShareFields;
  }, []);

  return (
    <>
      <Button
        variant="text"
        {...ButtonProps}
        startIcon={<MailOutlineIcon fontSize="small" />}
        onClick={() => setOpen(true)}
      >
        Secure with Email
      </Button>
      <PangeaModal
        open={open}
        onClose={handleClose}
        title={"Secure Share Links with Email"}
        size="medium"
      >
        <FieldsForm
          object={obj}
          fields={fields}
          onSubmit={(values) => {
            return handleCreateShare(
              // @ts-ignore
              pickBy(values, (v, k) => !!v && k !== "emails")
            )
              .then(() => {})
              .finally(handleClose);
          }}
          disabled={loading}
        />
      </PangeaModal>
    </>
  );
};

export default CreateSharesViaEmailButton;
