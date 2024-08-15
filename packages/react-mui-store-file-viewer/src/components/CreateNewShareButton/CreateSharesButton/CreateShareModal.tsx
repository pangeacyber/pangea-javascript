import {
  Button,
  ButtonProps,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { FC, forwardRef, useEffect, useMemo, useState } from "react";
import pickBy from "lodash/pickBy";
import isEmpty from "lodash/isEmpty";
import omit from "lodash/omit";
import keyBy from "lodash/keyBy";
import mapValues from "lodash/mapValues";
import * as yup from "yup";

import { useTheme } from "@mui/material/styles";

import {
  FieldsForm,
  FieldsFormSchema,
  PangeaModal,
} from "@pangeacyber/react-mui-shared";
import { ObjectStore } from "../../../types";
import {
  useStoreFileViewerContext,
  useCreateShareContext,
} from "../../../hooks/context";
import { ShareCreateForm, getCreateShareFields } from "./fields";
import ShareSettings from "./ShareSettings";
import { alertOnError } from "../../AlertSnackbar/hooks";
import { EmailPasswordShare } from "../SendShareViaEmailButton/EmailPasswordShareField";
import { EmailSmsShare } from "../SendShareViaEmailButton/EmailSmsShareField";

type ShareSendObj = EmailPasswordShare | EmailSmsShare | undefined;

const CreateButton = forwardRef<any, ButtonProps>((props, ref) => {
  // @ts-ignore
  const isSaving = props?.children?.endsWith("...");
  return (
    <Button ref={ref} {...props} sx={{ minWidth: "100px" }}>
      {isSaving ? "Sending..." : "Send"}
    </Button>
  );
});

interface Props {
  object: ObjectStore.ObjectResponse;
  open: boolean;
  onClose: () => void;
  onDone: () => void;
}

const ShareCreateRequestFields = new Set([
  "targets",
  "link_type",
  "expires_at",
  "max_access_count",
  "authenticators",
  "title",
  "message",
]);

const CreateShareModal: FC<Props> = ({ object, open, onClose, onDone }) => {
  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.down("lg"));
  const {
    shareType,
    loading,
    sent,
    setLoading,
    setSent,
    setErrors,
    setShareLink,
    resetContext,
  } = useCreateShareContext();

  const { apiRef, triggerUpdate, configurations, defaultShareLinkTitle } =
    useStoreFileViewerContext();
  const [settings, setSettings] = useState(false);

  const defaultAccessCount = configurations?.settings?.defaultAccessCount ?? 10;
  const [obj, setObj] = useState<ShareCreateForm>({
    shareType: shareType,
    targets: [],
    authenticators: [],
    link_type: "download",
    expires_at: "",
    max_access_count: defaultAccessCount,
    contentType: object?.type ?? "file",
    authenticatorType: ObjectStore.ShareAuthenticatorType.Sms,
    title: defaultShareLinkTitle,
  });

  const [settingsObj, setSettingsObj] = useState(obj);
  const [settingsError, setSettingsError] = useState(false);

  useEffect(() => {
    var date = configurations?.settings?.defaultExpiresAt;
    if (!date) {
      date = new Date();
      date.setDate(date.getDate() + 7);
    }

    const newObj = {
      shareType: shareType,
      targets: [],
      authenticators: [],
      link_type: "download",
      expires_at: date.toISOString(),
      max_access_count: defaultAccessCount,
      contentType: object?.type ?? "file",
      authenticatorType: ObjectStore.ShareAuthenticatorType.Sms,
      title: defaultShareLinkTitle,
    };

    setObj(newObj);
    setSettingsObj(newObj);
    setSettingsError(false);
  }, [object, defaultShareLinkTitle]);

  useEffect(() => {
    if (!isLarge && open) {
      setSettings(true);
    } else if (isLarge && open) {
      setSettings(false);
    }
  }, [isLarge, open]);

  const handleClose = () => {
    resetContext();
    onClose();
  };

  const handleCreateShare = async (
    body: ObjectStore.SingleShareCreateRequest
  ) => {
    if (sent) return false;
    if (!apiRef.share?.create) return false;
    setLoading(true);
    setShareLink(undefined);

    const authByPhone = keyBy(body?.authenticators || [], "phone_number");
    const emails = body?.authenticators?.map((auth) => {
      return auth.notify_email;
    });

    return apiRef.share
      .create({
        links: (body?.authenticators ?? [])?.map((auth) => {
          return {
            ...body,
            targets: [object.id],
            authenticators: [omit(auth, ["notify_email", "phone_number"])],
          };
        }),
      })
      .then((response) => {
        triggerUpdate();

        const shares: ObjectStore.ShareObjectResponse[] =
          response?.result?.share_link_objects ?? [];

        // send share notifications
        if (shareType === "email") {
          const data: Record<string, ShareSendObj> = mapValues(
            keyBy(
              shares.filter((s) => !!s.authenticators?.length),
              "id"
            ),
            (share) => {
              const definingAuthType = (share.authenticators ?? [])[0];

              if (
                definingAuthType.auth_type ===
                ObjectStore.ShareAuthenticatorType.Password
              ) {
                return {
                  id: share.id,
                  link: share.link,
                  emails: emails,
                  type: "password",
                } as EmailPasswordShare;
              }

              if (
                definingAuthType.auth_type ===
                ObjectStore.ShareAuthenticatorType.Sms
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
            } else {
              const email = authByPhone[d.phone]?.notify_email;
              if (email) {
                links.push({
                  id: d.id,
                  email: email,
                });
              }
            }
          });

          if (!apiRef.share?.send) return;

          return apiRef.share
            .send({
              sender_email: "no-reply@pangea.cloud",
              links,
            })
            .finally(() => {
              setLoading(false);
              onDone();
            });
        }
        // show copyable share link
        else if (shareType === "link") {
          setSent(true);
          setShareLink(shares[0]);
        }
      })
      .catch((err) => {
        alertOnError(err);
        setLoading(false);

        return false;
      })
      .finally(() => {
        setLoading(false);
        if (shareType === "email") {
          onDone();
        }
      });
  };

  const fields = useMemo<
    FieldsFormSchema<ObjectStore.SingleShareCreateRequest>
  >(() => {
    return getCreateShareFields();
  }, [object?.type, configurations]);

  return (
    <PangeaModal
      open={open}
      onClose={handleClose}
      displayCloseIcon
      title=""
      header={
        <Stack
          direction="row"
          width="100%"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography
            variant="h5"
            sx={{ overflow: "hidden", wordBreak: "break-all" }}
          >
            {`Secure link for ${object?.name ?? "unknown"}`}
          </Typography>
          <ShareSettings
            object={settingsObj}
            onSubmit={async (values) =>
              setSettingsObj((state) => ({ ...state, ...values }))
            }
            onError={(errors) => {
              setSettingsError(!isEmpty(errors));
            }}
            open={settings}
            setOpen={setSettings}
          />
        </Stack>
      }
      size="medium"
    >
      <FieldsForm
        object={obj}
        fields={fields}
        onSubmit={(values) => {
          return handleCreateShare(
            // @ts-ignore
            pickBy(
              {
                ...values,
                expires_at: settingsObj.expires_at,
                max_access_count: settingsObj.max_access_count,
              },
              (v, k) => !!v && ShareCreateRequestFields.has(k)
            )
          ).then((isSuccess) => {
            if (isSuccess && shareType === "email") {
              handleClose();
            }
          });
        }}
        validation={{
          schema: yup.object().shape({
            authenticators: yup
              .array()
              .min(1, "At least one recipient is required.")
              .test(
                "validate-phone",
                "Missing recipient phone number.",
                function (value: any, context) {
                  if (context?.parent?.shareType === "link") {
                    return true;
                  }

                  const authType_ = context?.parent?.authenticatorType || "";
                  let isValid = true;
                  value.forEach((r: any) => {
                    if (
                      authType_ === ObjectStore.ShareAuthenticatorType.Sms &&
                      !r.phone_number
                    ) {
                      isValid = false;
                    }
                  });
                  return isValid;
                }
              ),
            password: yup
              .string()
              .test(
                "validate-password",
                "A password is required.",
                function (value: string | undefined, context) {
                  if (context?.parent?.shareType === "link") {
                    return true;
                  }
                  const authType_ = context?.parent?.authenticatorType || "";
                  const firstAuth = context?.parent?.authenticators[0];
                  const isValid =
                    authType_ !== ObjectStore.ShareAuthenticatorType.Password ||
                    (authType_ ===
                      ObjectStore.ShareAuthenticatorType.Password &&
                      !!firstAuth?.auth_context);
                  setErrors(
                    isValid ? {} : { password: "A password is required." }
                  );

                  return isValid;
                }
              ),
          }),
        }}
        disabled={loading || settingsError}
        clearable={true}
        clearButtonLabel={shareType === "link" ? "Done" : "Cancel"}
        onCancel={handleClose}
        autoSave={shareType === "link" ? true : false}
        // @ts-ignore
        SaveButton={CreateButton}
        StackSx={{
          ".MuiFormControl-root": {
            margin: 0,
          },
        }}
      />
    </PangeaModal>
  );
};

export default CreateShareModal;
