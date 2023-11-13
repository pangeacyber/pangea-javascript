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

const UnControlledShareTypeField: FC<FieldComponentProps> = ({
  value,
  onValueChange = () => {},
}) => {
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
    </ToggleButtonGroup>
  );
};

const ShareTypeField: FC<FieldComponentProps> = (props) => {
  return (
    <FieldControl {...props}>
      <UnControlledShareTypeField {...props} />
    </FieldControl>
  );
};

export default ShareTypeField;
