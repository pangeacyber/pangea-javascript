import { FC, ReactNode } from "react";
import get from "lodash/get";
import omit from "lodash/omit";
import upperCase from "lodash/upperCase";

import FolderIcon from "@mui/icons-material/Folder";
import LockIcon from "@mui/icons-material/Lock";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

import {
  Badge,
  BadgeProps,
  Box,
  SvgIconProps,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

export enum MimeType {
  Pdf = "pdf",
  Png = "png",
  Jpeg = "jpeg",
  Jpg = "jpg",
  Txt = "txt",
  Docx = "docx",
}

export const MimeTypeColor = {
  [MimeType.Pdf]: "#F23140",
  [MimeType.Png]: "#469FF8",
  [MimeType.Jpeg]: "#469FF8",
  [MimeType.Jpg]: "#469FF8",
  [MimeType.Txt]: "#3A8D11",
  [MimeType.Docx]: "#3A8D11",
};

interface Props extends SvgIconProps {
  type: string;
  mimeType: string;
  password?: boolean;
}

const _PasswordBadge: FC<any> = (props) => {
  const theme = useTheme();
  return (
    <span
      {...omit(props, ["ownerState"])}
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        position: "absolute",
        minWidth: "8px",
        lineHeight: 1,
        padding: 0,
        height: "16px",
        borderRadius: "8px",
        zIndex: 1,
        transition: "transform 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
        backgroundColor: theme.palette.background.paper,
        bottom: "14%",
        right: "14%",
        transform: "scale(1) translate(50%, 50%)",
        transformOrigin: "100% 100%",
      }}
    >
      <LockIcon style={{ fontSize: "0.8rem" }} />
    </span>
  );
};

const PasswordBadge: FC<{
  children: ReactNode;
  password?: boolean;
}> = ({ children, password }) => {
  if (!password) {
    return <>{children}</>;
  }

  return (
    <Tooltip title="Password protected file">
      <Badge
        variant="dot"
        overlap="circular"
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        sx={{
          ".MuiBadge-badge": {
            border: `1px solid transparent`,
          },
        }}
        color="info"
        badgeContent={<LockIcon />}
        slots={{
          badge: _PasswordBadge,
        }}
      >
        {children}
      </Badge>
    </Tooltip>
  );
};

const StoreObjectIcon: FC<Props> = ({ type, mimeType, password, ...props }) => {
  if (type === "folder") {
    return (
      <PasswordBadge password={password}>
        <FolderIcon {...props} />
      </PasswordBadge>
    );
  }

  const color = get(MimeTypeColor, mimeType, "inherit");
  if (mimeType.length <= 4) {
    return (
      <PasswordBadge password={password}>
        <Box
          sx={{
            width: "fit-content",
            position: "relative",
            height: "24px",
            lineHeight: "22px",
          }}
        >
          <InsertDriveFileIcon style={{ fill: color }} {...props} />
          <Typography
            sx={{
              position: "absolute",
              bottom: "6px",
              left: "5px",
              fontSize: "7px",
              color: "#fff",
              height: "17px",
              lineHeight: "1.5rem",
            }}
          >
            {upperCase(mimeType)}
          </Typography>
        </Box>
      </PasswordBadge>
    );
  }

  return (
    <PasswordBadge password={password}>
      <InsertDriveFileIcon style={{ fill: color }} {...props} />
    </PasswordBadge>
  );
};

export default StoreObjectIcon;
