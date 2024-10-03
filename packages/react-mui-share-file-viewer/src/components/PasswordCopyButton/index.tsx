import { FC, MouseEvent, useEffect, useState } from "react";
import {
  ButtonGroup,
  ButtonProps,
  Button,
  Stack,
  SvgIconProps,
  Typography,
} from "@mui/material";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import { VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";

export interface CopyProps extends ButtonProps {
  label: string;
  IconProps?: SvgIconProps;
  copiedText?: string;
}

export const handleOnCopy = (value: any) => {
  if (value && typeof value === "string") {
    navigator.clipboard.writeText(value);
  }
};

const CopyPasswordButton: FC<CopyProps> = ({
  label,
  value,
  children,
  IconProps = {},
  copiedText = "Password copied!",
  ...props
}) => {
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = (e: MouseEvent) => {
    e.preventDefault();
    setShowPassword((show) => !show);
  };

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 1000);
    }
  }, [copied]);

  return (
    <ButtonGroup>
      <Button
        data-testid={`${label}-Copy-Button`}
        className="Password-Copy-Button"
        onClick={() => {
          handleOnCopy(value);
          setCopied(true);
        }}
        fullWidth
        endIcon={
          copied ? (
            <CheckCircleOutlineOutlinedIcon fontSize="small" {...IconProps} />
          ) : (
            <ContentCopyOutlinedIcon fontSize="small" {...IconProps} />
          )
        }
        sx={{
          paddingLeft: "0",
          paddingRight: "0",
        }}
        {...props}
        {...(copied && {
          color: "success",
        })}
      >
        <Typography
          variant="body2"
          sx={{
            width: "calc(100% - 60px)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            textAlign: "left",
            whiteSpace: "nowrap",
          }}
        >
          {copied ? copiedText : showPassword ? children : "************"}
        </Typography>
      </Button>
      <Button
        {...props}
        {...(copied && {
          color: "success",
        })}
      >
        {showPassword ? (
          <VisibilityOffOutlined
            fontSize="small"
            {...IconProps}
            onClick={handleShowPassword}
          />
        ) : (
          <VisibilityOutlined
            fontSize="small"
            {...IconProps}
            onClick={handleShowPassword}
          />
        )}
      </Button>
    </ButtonGroup>
  );
};

export default CopyPasswordButton;
