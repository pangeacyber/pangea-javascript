import {
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import {
  FieldComponentProps,
  FieldControl,
} from "@pangeacyber/react-mui-shared";
import { FC } from "react";

import CheckIcon from "@mui/icons-material/Check";

interface FieldProps {
  options?: {
    valueOptions?: string[];
  };
}

const UnControlledShareTypeField: FC<FieldComponentProps<FieldProps>> = ({
  value,
  onValueChange = () => {},
  FieldProps,
}) => {
  const hasDownload = FieldProps?.options?.valueOptions?.includes("download");
  const hasUpload = FieldProps?.options?.valueOptions?.includes("upload");

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newType: string
  ) => {
    onValueChange(newType);
  };

  return (
    <ToggleButtonGroup
      color="info"
      value={value}
      exclusive
      onChange={handleChange}
      aria-label="Platform"
      sx={{
        width: "100%",
      }}
    >
      {hasUpload && (
        <ToggleButton
          color="info"
          sx={{ width: "100%" }}
          size="small"
          fullWidth
          value="upload"
        >
          <Stack direction="row" spacing={1} alignItems="center">
            {value === "upload" && <CheckIcon fontSize="small" />}
            <Typography variant="body2">Upload</Typography>
          </Stack>
        </ToggleButton>
      )}
      {hasDownload && (
        <ToggleButton
          fullWidth
          sx={{ width: "100%" }}
          size="small"
          color="info"
          value="download"
        >
          <Stack direction="row" spacing={1} alignItems="center">
            {value === "download" && <CheckIcon fontSize="small" />}
            <Typography variant="body2">Download</Typography>
          </Stack>
        </ToggleButton>
      )}
    </ToggleButtonGroup>
  );
};

const ShareTypeField: FC<FieldComponentProps<FieldProps>> = (props) => {
  return (
    <FieldControl {...props}>
      <UnControlledShareTypeField {...props} />
    </FieldControl>
  );
};

export default ShareTypeField;
