import { FieldComponentProps } from "@pangeacyber/react-mui-shared";
import { FC } from "react";
import ShareEmailsField from "../ShareEmailsField";
import { Stack } from "@mui/material";
import CopyLinkButton from "./CopyLinkButton";

export interface EmailPasswordShare {
  id: string;
  type: "password";
  link: string;
  emails: string[];
}

const EmailPasswordShareField: FC<FieldComponentProps> = ({
  onValueChange,
  ...props
}) => {
  const value: EmailPasswordShare = props.value || {
    id: "",
    link: "",
    emails: [],
  };

  const emails = value.emails;

  const handleEmailsChange = (emails: string[]) => {
    if (!onValueChange) return;
    onValueChange({
      ...value,
      emails,
    });
  };

  if (!value.id) return null;
  return (
    <Stack spacing={1}>
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
      <ShareEmailsField
        {...props}
        value={emails}
        onValueChange={handleEmailsChange}
      />
    </Stack>
  );
};

export default EmailPasswordShareField;
