import { FC, useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import {
  DeleteOutlineRounded,
  EmailOutlined,
  LinkRounded,
  MoreVert,
} from "@mui/icons-material";

import { useStoreFileViewerContext } from "../../hooks/context";
import { ObjectStore } from "../../types";

interface Props {
  object: ObjectStore.ShareObjectResponse;
  onDelete?: () => void;
}

const ShareOptions: FC<Props> = ({ object, onDelete }) => {
  const [updating, setUpdating] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const { apiRef, configurations } = useStoreFileViewerContext();
  const [optionsEl, setOptionsEl] = useState<HTMLElement | null>(null);

  const handleRemove = () => {
    if (!object?.id || !apiRef?.share?.delete) return;

    setUpdating(true);
    apiRef.share
      .delete({
        ids: [object.id],
      })
      .finally(() => {
        if (onDelete) onDelete();
        setUpdating(false);
        handleClose;
      });
  };

  const resendEmail = () => {
    if (
      !object?.id ||
      !apiRef?.share?.send ||
      !object?.recipient_email ||
      sending
    )
      return;

    setSending(true);
    const links: ObjectStore.ShareLinkToSend[] = [
      { id: object.id, email: object.recipient_email },
    ];

    apiRef.share
      .send({
        sender_email:
          object.sender_email ||
          configurations?.sender?.email ||
          "no-reply@pangea.cloud",
        sender_name: object.sender_name || configurations?.sender?.name,
        links,
      })
      .finally(() => {
        setSent(true);
        setSending(false);
      });
  };

  const copyLink = () => {
    if (object?.link && typeof object.link === "string") {
      navigator.clipboard.writeText(object.link);
      setCopied(true);
    }
  };

  const handleClose = () => {
    setOptionsEl(null);
  };

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
        setOptionsEl(null);
      }, 1000);
    }
  }, [copied]);

  useEffect(() => {
    if (sent) {
      setTimeout(() => {
        setSent(false);
        setOptionsEl(null);
      }, 1000);
    }
  }, [sent]);

  return (
    <Box sx={{ marginLeft: "auto" }}>
      <IconButton
        onClick={(event) => {
          setOptionsEl(event.currentTarget);
          event.stopPropagation();
        }}
        data-testid={`Share-${object?.id}-Options-Btn`}
      >
        <MoreVert />
      </IconButton>
      <Menu
        open={!!optionsEl}
        anchorEl={optionsEl}
        onClose={() => setOptionsEl(null)}
        sx={{
          ".MuiList-root": {
            width: "200px",
          },
          button: {
            justifyContent: "start",
            paddingLeft: 2,
          },
          ".MuiButton-textPrimary": {
            color: (theme) => theme.palette.text.primary,
          },
        }}
      >
        {!!object.id && !!object.link && !!object.recipient_email && (
          <MenuItem onClick={resendEmail} disabled={sending || sent}>
            <Stack direction="row" gap={1}>
              <EmailOutlined fontSize="small" />
              <Typography variant="body2">
                {sending
                  ? "Sending email"
                  : sent
                    ? "Email sent"
                    : "Resend email"}
              </Typography>
            </Stack>
          </MenuItem>
        )}
        {!!object.id && !!object.link && !object.recipient_email && (
          <MenuItem onClick={copyLink} disabled={copied}>
            <Stack direction="row" gap={1}>
              <LinkRounded fontSize="small" />
              <Typography variant="body2">
                {copied ? "Link copied" : "Copy link"}
              </Typography>
            </Stack>
          </MenuItem>
        )}
        <MenuItem onClick={handleRemove} disabled={updating}>
          <Stack direction="row" gap={1}>
            <DeleteOutlineRounded fontSize="small" />
            <Typography variant="body2">
              {updating ? "Deleting" : "Remove"}
            </Typography>
          </Stack>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ShareOptions;
