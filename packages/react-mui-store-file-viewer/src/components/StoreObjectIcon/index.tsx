import { FC } from "react";
import get from "lodash/get";
import upperCase from "lodash/upperCase";

import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

import { Box, SvgIconProps, Typography } from "@mui/material";

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
}

const StoreObjectIcon: FC<Props> = ({ type, mimeType, ...props }) => {
  if (type === "folder") {
    return <FolderIcon {...props} />;
  }

  const color = get(MimeTypeColor, mimeType, "inherit");
  if (mimeType.length <= 4) {
    return (
      <Box
        sx={{
          width: "fit-content",
          height: "fit-content",
          position: "relative",
        }}
      >
        <InsertDriveFileIcon style={{ fill: color }} />
        <Typography
          sx={{
            position: "absolute",
            bottom: "6px",
            left: "5px",
            fontSize: "7px",
            color: "#fff",
          }}
        >
          {upperCase(mimeType)}
        </Typography>
      </Box>
    );
  }

  return <InsertDriveFileIcon style={{ fill: color }} {...props} />;
};

export default StoreObjectIcon;
