import { ButtonProps, Button, SvgIconProps, Typography } from "@mui/material";

import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import LinkIcon from "@mui/icons-material/Link";

import { FC, useEffect, useState } from "react";

export interface CopyProps extends ButtonProps {
  label: string;
  IconProps?: SvgIconProps;
  copiedText?: string;
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
  copiedText = "Link copied!",
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
      startIcon={<LinkIcon fontSize="small" />}
      endIcon={
        copied ? (
          <CheckCircleOutlineOutlinedIcon fontSize="small" {...IconProps} />
        ) : (
          <ContentCopyOutlinedIcon fontSize="small" {...IconProps} />
        )
      }
      {...props}
      {...(copied && {
        color: "success",
      })}
    >
      <Typography
        variant="body2"
        sx={{
          width: "calc(100% - 40px)",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {copied ? copiedText : children}
      </Typography>
    </Button>
  );
};

export default CopyLinkButton;
