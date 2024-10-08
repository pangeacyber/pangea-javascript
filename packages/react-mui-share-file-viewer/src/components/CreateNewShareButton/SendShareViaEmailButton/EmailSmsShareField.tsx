import {
  FieldComponentProps,
  StringField,
} from "@pangeacyber/react-mui-shared";
import { FC } from "react";
import { Stack, TextField, Typography } from "@mui/material";
import CopyLinkButton from "./CopyLinkButton";

export interface EmailSmsShare {
  id: string;
  type: "sms";
  link: string;
  email: string;
  phone: string;
}

const EmailSmsShareField: FC<FieldComponentProps> = ({
  onValueChange,
  ...props
}) => {
  const value: EmailSmsShare = props.value || {
    id: "",
  };

  const handleEmailChange = (email: string) => {
    if (!onValueChange) return;
    onValueChange({
      ...value,
      email,
    });
  };

  if (!value.id) return null;
  const errors = props?.errors?.email;
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Typography color="textSecondary" variant="body2">
        {value.phone}
      </Typography>
      <StringField
        {...props}
        errors={errors}
        FieldProps={{
          type: "text",
          placeholder: "Email to send the link to",
        }}
        value={value.email}
        onValueChange={handleEmailChange}
        sx={{
          minWidth: "250px",
          ...props?.sx,
        }}
      />
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

export default EmailSmsShareField;
