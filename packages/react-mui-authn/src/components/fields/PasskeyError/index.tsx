import { FC } from "react";
import { Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { VpnKeyRounded, WarningRounded } from "@mui/icons-material";

import Button from "@src/components/core/Button";

interface Props {
  label: string;
  error?: string;
  showLock?: boolean;
  onClick: () => void;
}

const PasskeyError: FC<Props> = ({
  label,
  error,
  showLock = false,
  onClick,
}) => {
  const theme = useTheme();

  return (
    <Stack>
      <Button
        variant="text"
        fullWidth
        sx={{
          color: theme.palette.error.main,
          cursor: "default",
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          backgroundColor: "#FCE3D6", // TODO: use a theme value
          "&:hover": {
            backgroundColor: "#FCE3D6",
          },
        }}
      >
        <Stack
          direction="row"
          gap={1}
          alignItems="center"
          justifyContent="center"
        >
          <WarningRounded
            sx={{ fontSize: "20px", color: theme.palette.error.main }}
          />
          Authentication failed
        </Stack>
      </Button>
      <Button
        color="secondary"
        fullWidth
        onClick={onClick}
        sx={{
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        }}
      >
        <Stack direction="row" gap={1}>
          {showLock && <VpnKeyRounded sx={{ fontSize: "20px" }} />}
          {label}
        </Stack>
      </Button>
      {error && (
        <Stack direction="row" justifyContent="center" pt={1}>
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        </Stack>
      )}
    </Stack>
  );
};

export default PasskeyError;
