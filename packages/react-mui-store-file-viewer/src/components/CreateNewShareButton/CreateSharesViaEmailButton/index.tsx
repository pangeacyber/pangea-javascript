import { Button, ButtonProps } from "@mui/material";
import { FC, useMemo, useState } from "react";
import pickBy from "lodash/pickBy";
import merge from "lodash/merge";
import cloneDeep from "lodash/cloneDeep";

import MailOutlineIcon from "@mui/icons-material/MailOutline";

import {
  FieldsForm,
  FieldsFormSchema,
  PangeaModal,
} from "@pangeacyber/react-mui-shared";
import { ObjectStore } from "../../../types";
import { useStoreFileViewerContext } from "../../../hooks/context";
import { CreateEmailShareFields } from "./fields";
import { alertOnError } from "../../AlertSnackbar/hooks";

const CreateAndSendButton: FC<ButtonProps> = (props) => {
  // @ts-ignore
  const isSaving = props?.children?.endsWith("...");
  return (
    <Button {...props}>{isSaving ? "Sending..." : "Create and Send"}</Button>
  );
};

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
  const { apiRef, triggerUpdate } = useStoreFileViewerContext();
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
      .then(async (response) => {
        triggerUpdate();

        const links = response?.result?.share_link_objects ?? [];
        if (links.length && apiRef.share?.send) {
          const body: ObjectStore.ShareSendRequest = {
            sender_email: "",
            links: [],
          };

          links?.forEach((l) => {
            const newLinks: ObjectStore.ShareLinkToSend[] =
              l.authenticators
                ?.filter((auth) => {
                  return (
                    auth.auth_type ===
                      ObjectStore.ShareAuthenticatorType.Email &&
                    !!auth.auth_context
                  );
                })
                .map((auth) => ({
                  email: auth.auth_context,
                  id: l.id,
                })) ?? [];

            body.links = body.links.concat(newLinks);
          });

          if (!body.links.length) {
            return response;
          }

          return apiRef.share
            .send(body)
            .then(() => links)
            .catch((err) => {
              throw err;
            });
        }

        return response;
      })
      .catch((err) => {
        alertOnError(err);
      })
      .finally(() => {
        setLoading(false);
        onDone();
      });
  };

  const fields = useMemo<
    FieldsFormSchema<ObjectStore.SingleShareCreateRequest>
  >(() => {
    if (object?.type === "folder") {
      return CreateEmailShareFields;
    }

    return merge(cloneDeep(CreateEmailShareFields), {
      link_type: {
        FieldProps: {
          options: {
            valueOptions: ["download"],
          },
        },
      },
    });
  }, [object?.type]);

  return (
    <>
      <Button
        variant="text"
        {...ButtonProps}
        startIcon={<MailOutlineIcon fontSize="small" />}
        onClick={() => setOpen(true)}
      >
        {ButtonProps?.children || "Secure with Email"}
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
          SaveButton={CreateAndSendButton}
          StackSx={{
            ".MuiFormControl-root": {
              margin: 0,
            },
          }}
        />
      </PangeaModal>
    </>
  );
};

export default CreateSharesViaEmailButton;
