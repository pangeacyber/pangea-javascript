import { FieldComponentProps } from "@pangeacyber/react-mui-shared";
import { FC } from "react";
import { Stack, Typography } from "@mui/material";
import CopyLinkButton from "./CopyLinkButton";

export interface EmailEmailShare {
  id: string;
  type: "email";
  link: string;
  email: string;
}

const EmailEmailShareField: FC<FieldComponentProps> = ({
  onValueChange,
  ...props
}) => {
  const value: EmailEmailShare = props.value || {
    id: "",
  };

  if (!value) return null;
  return (
    <Stack direction="row" spacing={1} alignItems="center" width="100%">
      <Typography color="textSecondary" variant="body2" minWidth="200px">
        {value.email}
      </Typography>
      <CopyLinkButton
        variant="contained"
        color="secondary"
        fullWidth
        label={`Share link (${value.id})`}
        data-testid={"Share-Copy-Btn"}
        value={value.link}
      >
        {value.link}
      </CopyLinkButton>
    </Stack>
  );
};

export default EmailEmailShareField;
