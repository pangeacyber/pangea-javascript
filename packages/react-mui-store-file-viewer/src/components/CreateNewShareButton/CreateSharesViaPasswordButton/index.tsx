import { Button, ButtonProps } from "@mui/material";
import { FC, useMemo, useState } from "react";
import pickBy from "lodash/pickBy";
import merge from "lodash/merge";
import cloneDeep from "lodash/cloneDeep";

import PasswordIcon from "@mui/icons-material/Password";

import {
  FieldsForm,
  FieldsFormSchema,
  PangeaModal,
} from "@pangeacyber/react-mui-shared";
import { ObjectStore } from "../../../types";
import { useStoreFileViewerContext } from "../../../hooks/context";
import { CreatePasswordShareFields } from "./fields";
import SendShareViaEmailButton from "../SendShareViaEmailButton";

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

  const [share, setShare] = useState<
    ObjectStore.ShareObjectResponse | undefined
  >(undefined);

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
    setShare(undefined);
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
      .then((newShare) => {
        setLoading(false);
        if (newShare?.result?.share_link_objects?.length) {
          setOpen(false);
          setShare(newShare?.result?.share_link_objects[0]);
        } else {
          onDone();
          handleClose();
        }
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const fields = useMemo<
    FieldsFormSchema<ObjectStore.SingleShareCreateRequest>
  >(() => {
    return merge(cloneDeep(CreatePasswordShareFields), {
      password: {
        FieldProps: {
          policy: configurations?.passwordPolicy ?? {
            chars_min: 8,
          },
        },
      },
      ...(object.type !== "folder" && {
        link_type: {
          FieldProps: {
            options: {
              valueOptions: ["download"],
            },
          },
        },
      }),
    });
  }, [object?.type, configurations?.passwordPolicy]);

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
            );
          }}
          disabled={loading}
        />
      </PangeaModal>
      {!!share?.id && (
        <SendShareViaEmailButton
          object={share}
          defaultOpen={true}
          onClose={handleClose}
          onDone={handleClose}
        />
      )}
    </>
  );
};

export default CreateSharesViaPasswordButton;
