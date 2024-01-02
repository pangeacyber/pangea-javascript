import { ButtonProps, Button, SvgIconProps } from "@mui/material";

import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import { FC, useEffect, useState } from "react";

export interface CopyProps extends ButtonProps {
  label: string;
  IconProps?: SvgIconProps;
}

export const handleOnCopy = (value: any, label: string) => {
  if (value && typeof value === "string") {
    navigator.clipboard.writeText(value);
  }
};

const CopyLinkButton: FC<CopyProps> = ({
  label,
  value,
  children,
  IconProps = {},
  ...props
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 1000);
    }
  }, [copied]);

  return (
    <Button
      data-testid={`${label}-Copy-Button`}
      className="Pangea-Copy-Button"
      onClick={() => {
        handleOnCopy(value, label);
        setCopied(true);
      }}
      startIcon={
        copied ? (
          <CheckCircleOutlineOutlinedIcon
            color="success"
            fontSize="small"
            {...IconProps}
          />
        ) : (
          <ContentCopyOutlinedIcon fontSize="small" {...IconProps} />
        )
      }
      {...props}
    >
      {children}
    </Button>
  );
};

export default CopyLinkButton;
