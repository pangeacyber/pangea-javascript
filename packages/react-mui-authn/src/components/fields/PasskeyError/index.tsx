import { FC } from "react";
import { Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { VpnKeyRounded, WarningRounded } from "@mui/icons-material";

import Button from "@src/components/core/Button";

interface Props {
  label: string;
  showLock?: boolean;
  onClick: () => void;
}

const PasskeyError: FC<Props> = ({ label, showLock = false, onClick }) => {
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
    </Stack>
  );
};

export default PasskeyError;
