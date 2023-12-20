import { Button, ButtonProps, IconButton, Stack } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { FC, useMemo, useState } from "react";
import pickBy from "lodash/pickBy";

import {
  FieldsForm,
  FieldsFormSchema,
  PangeaModal,
} from "@pangeacyber/react-mui-shared";
import { ObjectStore } from "../../../types";
import { useStoreFileViewerContext } from "../../../hooks/context";
import { ShareShareViaEmailFields } from "./fields";
import CopyLinkButton from "./CopyLinkButton";

interface Props {
  object: ObjectStore.ShareObjectResponse;
  defaultOpen?: boolean;
  Button?: FC<ButtonProps>;
  onClose?: () => void;
  onDone?: () => void;
}

const SendIconButton: FC<ButtonProps> = (props) => {
  return (
    <IconButton size="small" {...props}>
      <SendIcon color="action" fontSize="small" />
    </IconButton>
  );
};

const ConfirmSendButton: FC<ButtonProps> = (props) => {
  // @ts-ignore
  const isSaving = props?.children?.endsWith("...");
  return <Button {...props}>{isSaving ? "Sending..." : "Send"}</Button>;
};

const SendShareViaEmailButton: FC<Props> = ({
  object,
  defaultOpen,
  Button: CustomButton = SendIconButton,
  onClose = () => {},
  onDone = () => {},
}) => {
  const { apiRef } = useStoreFileViewerContext();
  const [open, setOpen] = useState(defaultOpen ?? false);

  const [loading, setLoading] = useState(false);

  const obj = useMemo<ObjectStore.ShareSendRequest>(() => {
    return {
      from_prefix: "",
      links:
        object?.authenticators
          ?.filter((auth) => {
            return (
              auth.auth_type === ObjectStore.ShareAuthenticatorType.Email &&
              !!auth.auth_context
            );
          })
          .map((auth) => {
            return {
              email: auth.auth_context,
              id: object.id,
            };
          }) ?? [],
    };
  }, [object]);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  const handleSendShare = async (body: ObjectStore.ShareSendRequest) => {
    if (!apiRef.share?.send || !object) return;

    setLoading(true);
    if (!apiRef.share?.send) return;
    return apiRef.share
      .send({
        from_prefix: "",
        links: (body?.links ?? [])?.map((l) => {
          return {
            ...l,
            id: object.id,
          };
        }),
      })
      .finally(() => {
        setLoading(false);
        onDone();
      });
  };

  const fields = useMemo<FieldsFormSchema<ObjectStore.ShareSendRequest>>(() => {
    return ShareShareViaEmailFields;
  }, []);

  if (!apiRef.share?.send || !object?.id) return null;
  return (
    <>
      {!defaultOpen && (
        <CustomButton
          data-testid={`Send-Share-${object.id}-Btn`}
          onClick={() => {
            setOpen(true);
          }}
        />
      )}
      <PangeaModal
        open={open}
        onClose={handleClose}
        title={"Send out Share Link"}
        size="medium"
      >
        <Stack spacing={1} width="100%">
          {!!object?.link && (
            <CopyLinkButton
              variant="outlined"
              color="primary"
              fullWidth
              label={`Share link (${object.id})`}
              data-testid={"Share-Copy-Btn"}
              value={object.link}
            >
              Copy Link
            </CopyLinkButton>
          )}
          <FieldsForm
            object={obj}
            fields={fields}
            clearable
            onCancel={handleClose}
            onSubmit={(values) => {
              return handleSendShare(
                // @ts-ignore
                pickBy(values, (v, k) => !!v && k !== "emails")
              )
                .then(() => {})
                .finally(handleClose);
            }}
            disabled={loading}
            SaveButton={ConfirmSendButton}
          />
        </Stack>
      </PangeaModal>
    </>
  );
};

export default SendShareViaEmailButton;
