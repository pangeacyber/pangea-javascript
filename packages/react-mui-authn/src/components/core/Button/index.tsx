import { FC, ReactNode } from "react";

import { Button as MuiButton, useTheme } from "@mui/material";
import { SxProps } from "@mui/material/styles";

interface Props {
  variant?: "contained" | "outlined" | "text";
  color?:
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning";
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  type?: "button" | "reset" | "submit";
  sx?: SxProps;
  children: ReactNode;
}

const Button: FC<Props> = ({
  variant,
  color,
  disabled = false,
  fullWidth = false,
  onClick,
  type = "button",
  sx,
  children,
}) => {
  const theme = useTheme();

  return (
    <MuiButton
      variant={variant}
      color={color}
      disabled={disabled}
      fullWidth={fullWidth}
      onClick={onClick}
      type={type}
      disableElevation={true}
      disableRipple={true}
      disableFocusRipple={true}
      sx={{ textTransform: "none", ...sx }}
    >
      {children}
    </MuiButton>
  );
};

export default Button;
