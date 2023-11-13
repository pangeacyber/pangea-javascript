import { Button, ButtonProps } from "@mui/material";
import { FC, useMemo, useState } from "react";
import pickBy from "lodash/pickBy";
import merge from "lodash/merge";

import PasswordIcon from "@mui/icons-material/Password";

import {
  FieldsForm,
  FieldsFormSchema,
  PangeaModal,
} from "@pangeacyber/react-mui-shared";
import { ObjectStore } from "../../../types";
import { useStoreFileViewerContext } from "../../../hooks/context";
import { CreatePasswordShareFields } from "./fields";

interface Props {
  object: ObjectStore.ObjectResponse;
  ButtonProps?: ButtonProps;
  onClose: () => void;
  onDone: () => void;
}

const CreateSharesViaPasswordButton: FC<Props> = ({
  object,
  ButtonProps,
  onClose,
  onDone,
}) => {
  const { apiRef, configurations } = useStoreFileViewerContext();
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
    return apiRef.share // @ts-ignore
      .create({
        links: [
          {
            ...body,
            targets: [object.id],
          },
        ],
      })
      .then(() => {
        setLoading(false);
        onDone();
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const fields = useMemo<
    FieldsFormSchema<ObjectStore.SingleShareCreateRequest>
  >(() => {
    return merge(CreatePasswordShareFields, {
      password: {
        FieldProps: {
          policy: configurations?.passwordPolicy ?? {
            chars_min: 8,
          },
        },
      },
    });
  }, [configurations?.passwordPolicy]);

  return (
    <>
      <Button
        variant="text"
        {...ButtonProps}
        startIcon={<PasswordIcon fontSize="small" />}
        onClick={() => setOpen(true)}
      >
        Secure with Password
      </Button>
      <PangeaModal
        open={open}
        onClose={handleClose}
        title={"Secure Share Link with Password"}
        size="medium"
      >
        <FieldsForm
          object={obj}
          fields={fields}
          onSubmit={(values) => {
            return handleCreateShare(
              // @ts-ignore
              pickBy(values, (v, k) => !!v && k !== "password")
            ).finally(handleClose);
          }}
          disabled={loading}
        />
      </PangeaModal>
    </>
  );
};

export default CreateSharesViaPasswordButton;
