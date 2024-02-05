import {
  Button,
  ButtonProps,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { FC, useEffect, useMemo, useState } from "react";
import pickBy from "lodash/pickBy";

import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from "@mui/icons-material/Settings";
import { useTheme } from "@mui/material/styles";

import {
  FieldsForm,
  FieldsFormSchema,
  PangeaModal,
} from "@pangeacyber/react-mui-shared";
import { ObjectStore } from "../../../types";
import { useStoreFileViewerContext } from "../../../hooks/context";
import { ShareCreateForm, getCreateShareFields } from "./fields";
import SendShareViaEmailModal from "../SendShareViaEmailButton/SendShareViaEmailModal";
import ShareSettings from "./ShareSettings";
import { alertOnError } from "../../AlertSnackbar/hooks";

const CreateButton: FC<ButtonProps> = (props) => {
  // @ts-ignore
  const isSaving = props?.children?.endsWith("...");

  // @ts-ignore
  const authenticatorType: string = props?.values?.authenticatorType;

  let label = "Create secure link";
  if (authenticatorType === ObjectStore.ShareAuthenticatorType.Email) {
    label = "Create email secured links";
  } else if (
    authenticatorType === ObjectStore.ShareAuthenticatorType.Password
  ) {
    label = "Create password secured link";
  } else if (authenticatorType === ObjectStore.ShareAuthenticatorType.Sms) {
    label = "Create SMS secured links";
  }

  return <Button {...props}>{isSaving ? "Sending..." : label}</Button>;
};

interface Props {
  object: ObjectStore.ObjectResponse;
  ButtonProps?: ButtonProps;
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

const CreateSharesButton: FC<Props> = ({
  object,
  ButtonProps,
  onClose,
  onDone,
}) => {
  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.down("lg"));

  const { apiRef, triggerUpdate, configurations, defaultShareLinkTitle } =
    useStoreFileViewerContext();
  const [open, setOpen] = useState(false);

  const [settings, setSettings] = useState(false);

  const [loading, setLoading] = useState(false);

  const [sending, setSending] = useState<ObjectStore.ShareObjectResponse[]>([]);
  const [password, setPassword] = useState<string>("");

  const defaultAccessCount = configurations?.settings?.defaultAccessCount ?? 10;
  const [obj, setObj] = useState<ShareCreateForm>({
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

  useEffect(() => {
    var date = configurations?.settings?.defaultExpiresAt;
    if (!date) {
      date = new Date();
      date.setDate(date.getDate() + 7);
    }

    const newObj = {
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
  }, [object, defaultShareLinkTitle]);

  useEffect(() => {
    if (!isLarge && open) {
      setSettings(true);
    } else if (isLarge && open) {
      setSettings(false);
    }
  }, [isLarge, open]);

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
      .then((response) => {
        triggerUpdate();

        // Instead we need to prompt open the modal
        const links = response?.result?.share_link_objects ?? [];
        if (links.length) {
          setOpen(false);
          setSending(links);
          if (
            body?.authenticators?.length === 1 &&
            body?.authenticators[0].auth_type === "password"
          ) {
            setPassword(body?.authenticators[0]?.auth_context ?? "");
          } else {
            setPassword("");
          }
        }

        return response;
      })
      .catch((err) => {
        alertOnError(err);
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
        onDone();
      });
  };

  const fields = useMemo<
    FieldsFormSchema<ObjectStore.SingleShareCreateRequest>
  >(() => {
    return getCreateShareFields();
  }, [object?.type, configurations]);

  return (
    <>
      <Button
        variant="text"
        {...ButtonProps}
        startIcon={<AddIcon fontSize="small" />}
        data-testid="New-Share-Btn"
        onClick={() => setOpen(true)}
      >
        {ButtonProps?.children || "Secure Link"}
      </Button>
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
              open={settings}
              setOpen={setSettings}
            />
          </Stack>
        }
        size="medium"
      >
        <>
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
              )
                .then(() => {})
                .finally(handleClose);
            }}
            disabled={loading}
            SaveButton={CreateButton}
            StackSx={{
              ".MuiFormControl-root": {
                margin: 0,
              },
            }}
          />
        </>
      </PangeaModal>
      <SendShareViaEmailModal
        open={!!sending.length}
        onClose={() => {
          setSending([]);
          setPassword("");
        }}
        shares={sending}
        password={password}
        onDone={onDone}
        clearButtonLabel="Done"
      />
    </>
  );
};

export default CreateSharesButton;
