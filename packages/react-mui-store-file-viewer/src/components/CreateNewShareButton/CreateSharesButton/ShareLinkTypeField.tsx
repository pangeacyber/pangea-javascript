import { Box, IconButton, Select, Stack, Typography } from "@mui/material";
import { useTheme, lighten } from "@mui/material/styles";
import {
  FieldComponentProps,
  FieldControl,
  SelectField,
} from "@pangeacyber/react-mui-shared";
import { FC, useState } from "react";

import { ObjectStore } from "../../../types";
import { useStoreFileViewerContext } from "../../../hooks/context";

import UploadIcon from "@mui/icons-material/Upload";
import DownloadIcon from "@mui/icons-material/Download";
import BorderColorIcon from "@mui/icons-material/BorderColor";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

interface FieldProps {
  options?: {
    valueOptions?: string[];
  };
}

const ShareLinkAccess: FC<{
  value: any;
  labels: string[];
}> = ({ labels, value }) => {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <IconButton sx={{ bgcolor: "#F6F9FC" }}>
        {value === "download" && <DownloadIcon fontSize="small" />}
        {value === "upload" && <UploadIcon fontSize="small" />}
        {value === "editor" && <BorderColorIcon fontSize="small" />}
      </IconButton>
      <Stack>
        <Stack direction="row" alignItems="center">
          <Typography variant="body2">{labels.join(", ")}</Typography>
          <ArrowDropDownIcon fontSize="small" />
        </Stack>
        {value === "download" && (
          <Typography variant="body2" color="textSecondary">
            People with this link can download files
          </Typography>
        )}
        {value === "upload" && (
          <Typography variant="body2" color="textSecondary">
            People with this link can upload files to the shared folder
          </Typography>
        )}
        {value === "editor" && (
          <Typography variant="body2" color="textSecondary">
            People with this link can download/upload and edit all files within
            the folder
          </Typography>
        )}
      </Stack>
    </Stack>
  );
};

const UnControlledShareLinkTypeField: FC<FieldComponentProps<any>> = ({
  ...props
}) => {
  const { configurations } = useStoreFileViewerContext();
  const theme = useTheme();
  const [authenticatorType, setAuthenticatorType] =
    useState<ObjectStore.ShareAuthenticatorType>(
      ObjectStore.ShareAuthenticatorType.Sms
    );

  return (
    <Stack spacing={0.5}>
      <SelectField
        {...props}
        label=""
        FieldProps={{
          ...props?.FieldProps,
          CustomValueEl: ShareLinkAccess,
          SelectFieldProps: {
            fullWidth: false,
          },
        }}
        variant="standard"
        sx={{
          ".MuiSelect-icon": {
            visibility: "hidden",
          },
          ".MuiSelect-select.MuiSelect-standard:focus": {
            bgcolor: "inherit",
          },
        }}
      />
    </Stack>
  );
};

const ShareLinkTypeField: FC<FieldComponentProps<FieldProps>> = (props) => {
  return (
    <FieldControl {...props}>
      <UnControlledShareLinkTypeField {...props} />
    </FieldControl>
  );
};

export default ShareLinkTypeField;
