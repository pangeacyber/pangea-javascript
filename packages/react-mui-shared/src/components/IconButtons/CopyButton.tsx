import { ButtonProps, IconButton, SvgIconProps } from "@mui/material";

import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import { FC } from "react";

interface CopyProps extends ButtonProps {
  label: string;
  IconProps?: SvgIconProps;
}

export const handleOnCopy = (value: any, label: string) => {
  if (value && typeof value === "string") {
    navigator.clipboard.writeText(value);
  }
};

const CopyButton: FC<CopyProps> = ({
  label,
  value,
  children,
  IconProps = {},
  ...props
}) => {
  // FIXME: Add inline copy animation
  return (
    <IconButton
      data-testid={`${label}-Copy-Button`}
      className="Pangea-Copy-Button"
      onClick={() => {
        handleOnCopy(value, label);
      }}
      {...props}
    >
      {children}
      <ContentCopyOutlinedIcon color="action" fontSize="small" {...IconProps} />
    </IconButton>
  );
};

export default CopyButton;
