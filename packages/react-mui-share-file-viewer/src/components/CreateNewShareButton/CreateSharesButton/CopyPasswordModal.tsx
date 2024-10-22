import { FC } from "react";
import { Stack, Typography } from "@mui/material";
import { useTheme, darken, lighten } from "@mui/material/styles";
import { PangeaModal } from "@pangeacyber/react-mui-shared";

import CopyPasswordButton from "../../PasswordCopyButton";

interface Props {
  password: string;
  open: boolean;
  onClose: () => void;
}

const CopyPasswordModal: FC<Props> = ({ password, open, onClose }) => {
  const theme = useTheme();
  const modify = theme.palette.mode === "dark" ? darken : lighten;

  return (
    <PangeaModal
      open={open}
      onClose={onClose}
      displayCloseIcon
      header={<Typography variant="h5">Share Link Password</Typography>}
    >
      <Stack gap={2}>
        <Typography variant="body2" color="textSecondary">
          Be sure to copy this password to your clipboard, you won't be able to
          access it again.
        </Typography>
        <CopyPasswordButton
          label={password}
          value={password}
          variant="contained"
          disableElevation
          sx={{
            bgcolor: modify(theme.palette.info.main, 0.9),
            color: theme.palette.info.main,
            ":hover": {
              bgcolor: modify(theme.palette.info.main, 0.8),
            },
            paddingLeft: "0",
            paddingRight: "0",
          }}
        >
          {password}
        </CopyPasswordButton>
      </Stack>
    </PangeaModal>
  );
};

export default CopyPasswordModal;
