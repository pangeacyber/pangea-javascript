import { Button, ButtonProps, Stack, Typography } from "@mui/material";
import { FC, useMemo, useState } from "react";

import {
  FieldsForm,
  FieldsFormSchema,
  PangeaModal,
} from "@pangeacyber/react-mui-shared";
import { ObjectStore } from "../../../types";
import { useStoreFileViewerContext } from "../../../hooks/context";
import { keyBy, mapValues } from "lodash";
import { EmailPasswordShare } from "./EmailPasswordShareField";
import { EmailEmailShare } from "./EmailEmailShareField";
import { EmailSmsShare } from "./EmailSmsShareField";
import {
  SharePasswordShareViaEmailFields,
  ShareSmsShareViaEmailFields,
  ShareEmailShareViaEmailFields,
} from "./fields";
import CopyLinkButton from "./CopyLinkButton";
import PasswordIcon from "@mui/icons-material/Password";

interface Props {
  shares: ObjectStore.ShareObjectResponse[];
  password?: string;

  clearButtonLabel?: string;

  open: boolean;
  onClose?: () => void;
  onDone?: () => void;
}

const ConfirmSendButton: FC<ButtonProps> = (props) => {
  // @ts-ignore
  const isSaving = props?.children?.endsWith("...");
  return <Button {...props}>{isSaving ? "Sending..." : "Send email"}</Button>;
};

type ShareSendObj =
  | EmailPasswordShare
  | EmailEmailShare
  | EmailSmsShare
  | undefined;

const SendShareViaEmailModal: FC<Props> = ({
  shares,
  password,
  clearButtonLabel,
  open,
  onClose = () => {},
  onDone = () => {},
}) => {
  const { apiRef } = useStoreFileViewerContext();

  const [loading, setLoading] = useState(false);

  const obj = useMemo<Record<string, ShareSendObj>>(() => {
    return mapValues(
      keyBy(
        shares.filter((s) => !!s.authenticators?.length),
        "id"
      ),
      (share) => {
        const definingAuthType = (share.authenticators ?? [])[0];
        if (
          definingAuthType.auth_type ===
          ObjectStore.ShareAuthenticatorType.Email
        ) {
          return {
            id: share.id,
            link: share.link,
            email: definingAuthType.auth_context,
            type: "email",
          } as EmailEmailShare;
        }

        if (
          definingAuthType.auth_type ===
          ObjectStore.ShareAuthenticatorType.Password
        ) {
          return {
            id: share.id,
            link: share.link,
            emails: [],
            type: "password",
          } as EmailPasswordShare;
        }

        if (
          definingAuthType.auth_type === ObjectStore.ShareAuthenticatorType.Sms
        ) {
          return {
            id: share.id,
            link: share.link,
            email: "",
            phone: definingAuthType.auth_context,
            type: "sms",
          } as EmailSmsShare;
        }

        return undefined;
      }
    );
  }, [shares]);

  const objAuthType = Object.values(obj)?.[0]?.type;

  const handleClose = () => {
    onClose();
  };

  const handleSendShare = async (data: Record<string, ShareSendObj>) => {
    if (!apiRef.share?.send || !shares) return;
    setLoading(true);

    const links: ObjectStore.ShareLinkToSend[] = [];
    Object.values(data).forEach((d) => {
      if (!d?.id) return;
      if (d.type === "password") {
        d.emails.forEach((email) => {
          if (!email) return;
          links.push({
            id: d.id,
            email,
          });
        });
      } else if (!!d.email) {
        links.push({
          id: d.id,
          email: d.email,
        });
      }
    });

    return apiRef.share
      .send({
        sender_email: "",
        links,
      })
      .finally(() => {
        setLoading(false);
        onDone();
      });
  };

  const fields = useMemo<FieldsFormSchema<ObjectStore.ShareSendRequest>>(() => {
    return mapValues(
      keyBy(
        shares.filter((s) => !!s.authenticators?.length),
        "id"
      ),
      (share) => {
        const definingAuthType = (share.authenticators ?? [])[0];
        if (
          definingAuthType.auth_type ===
          ObjectStore.ShareAuthenticatorType.Email
        ) {
          return ShareEmailShareViaEmailFields.links;
        }

        if (
          definingAuthType.auth_type ===
          ObjectStore.ShareAuthenticatorType.Password
        ) {
          return SharePasswordShareViaEmailFields.links;
        }

        if (
          definingAuthType.auth_type === ObjectStore.ShareAuthenticatorType.Sms
        ) {
          return ShareSmsShareViaEmailFields.links;
        }

        return {
          label: "",
          isHidden: () => true,
        };
      }
    );
  }, [shares]);

  if (!apiRef.share?.send || !shares.length) return null;
  return (
    <>
      <PangeaModal
        open={open}
        onClose={handleClose}
        title={"Copy or send secure links via email"}
        description={
          <Typography variant="body2" color="textSecondary">
            {objAuthType === "email"
              ? "Links secured by email will ask for the email and a code to gain access."
              : objAuthType === "password"
              ? "Links secured by password will ask for the password to gain access."
              : objAuthType === "sms"
              ? "Links secured by SMS will ask for the phone number and a code to gain access."
              : null}
          </Typography>
        }
        size="medium"
      >
        <Stack spacing={1} width="100%">
          {objAuthType === "password" && !!password && (
            <CopyLinkButton
              variant="contained"
              color="info"
              fullWidth
              label={`Share link password`}
              data-testid={"SharePassword-Copy-Btn"}
              value={password}
              startIcon={<PasswordIcon fontSize="small" />}
            >
              Copy share link password
            </CopyLinkButton>
          )}
          <FieldsForm
            object={obj}
            fields={fields}
            clearable
            clearButtonLabel={clearButtonLabel}
            onCancel={handleClose}
            onSubmit={(values) => {
              // @ts-ignore
              return handleSendShare(values)
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

export default SendShareViaEmailModal;
