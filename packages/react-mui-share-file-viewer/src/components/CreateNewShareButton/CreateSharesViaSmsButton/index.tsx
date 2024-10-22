import { Button, ButtonProps } from "@mui/material";
import { FC, useMemo, useState } from "react";
import pickBy from "lodash/pickBy";
import keyBy from "lodash/keyBy";
import merge from "lodash/merge";
import cloneDeep from "lodash/cloneDeep";

import LocalPhoneIcon from "@mui/icons-material/LocalPhone";

import {
  FieldsForm,
  FieldsFormSchema,
  PangeaModal,
  SaveButtonProps,
} from "@pangeacyber/react-mui-shared";
import { ObjectStore } from "../../../types";
import { useFileViewerContext } from "../../../hooks/context";
import { CreatePhoneShareFields } from "./fields";
import { alertOnError } from "../../AlertSnackbar/hooks";

const CreateAndSendButton: FC<
  SaveButtonProps<ObjectStore.SingleShareCreateRequest>
> = (props) => {
  // @ts-ignore
  const isSaving = props?.children?.endsWith("...");

  const canSend = !!(props?.values?.authenticators ?? []).filter((a) => {
    // @ts-ignore
    return !!a.recipient;
  }).length;

  return (
    <Button {...props}>
      {isSaving ? "Sending..." : canSend ? "Create and Send" : "Create"}
    </Button>
  );
};

interface Props {
  object: ObjectStore.ObjectResponse;
  ButtonProps?: ButtonProps;
  onClose: () => void;
  onDone: () => void;
}

const CreateSharesViaSmsButton: FC<Props> = ({
  object,
  ButtonProps,
  onClose,
  onDone,
}) => {
  const { apiRef, triggerUpdate } = useFileViewerContext();
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
            authenticators: [
              {
                auth_context: auth.auth_context,
                auth_type: auth.auth_type,
              },
            ],
          };
        }),
      })
      .then(async (response) => {
        triggerUpdate();
        const recipientMap = keyBy(body?.authenticators ?? [], "auth_context");

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
                    auth.auth_type === ObjectStore.ShareAuthenticatorType.Sms &&
                    // @ts-ignore Internal field our sending SMS
                    !!recipientMap[auth.auth_context]?.recipient
                  );
                })
                .map((auth) => ({
                  // @ts-ignore Internal field our sending SMS
                  email: recipientMap[auth.auth_context]?.recipient,
                  id: l.id,
                })) ?? [];

            body.links = body.links.concat(newLinks);
          });

          if (!body.links.length) {
            return response;
          }

          return apiRef.share
            .send(body)
            .then(() => response)
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
      return CreatePhoneShareFields;
    }

    return merge(cloneDeep(CreatePhoneShareFields), {
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
        startIcon={<LocalPhoneIcon fontSize="small" />}
        onClick={() => setOpen(true)}
      >
        {ButtonProps?.children || "Secure with Phone Number"}
      </Button>
      <PangeaModal
        open={open}
        onClose={handleClose}
        title={"Secure Share Links with Phone Number"}
        size="medium"
      >
        <FieldsForm
          object={obj}
          fields={fields}
          onSubmit={(values) => {
            return handleCreateShare(
              // @ts-ignore
              pickBy(values, (v, k) => !!v && k !== "phones")
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

export default CreateSharesViaSmsButton;
