import { ButtonGroup, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  AuthPasswordField,
  CopyButton,
  FieldComponentProps,
  FieldControl,
} from "@pangeacyber/react-mui-shared";
import { FC } from "react";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CopyLinkButton from "../CreateNewShareButton/SendShareViaEmailButton/CopyLinkButton";

interface FieldProps {
  options?: {
    valueOptions?: string[];
  };
}

const UnControlledPasswordWithMatchField: FC<
  FieldComponentProps<FieldProps>
> = ({ onValueChange, values, ...props }) => {
  const theme = useTheme();

  const value: string = props.value;

  return (
    <Stack spacing={2}>
      <Stack width="100%" spacing={1}>
        <ButtonGroup
          sx={{
            flexGrow: 1,
            width: "100%",
            ".MuiFormGroup-root": {
              width: "calc(100%)",
            },
            ".MuiPopper-root": {
              zIndex: theme.zIndex.modal + 1,
            },
          }}
        >
          <AuthPasswordField
            {...props}
            label=""
            value={value}
            onValueChange={onValueChange}
            FieldProps={{
              ...props?.FieldProps,
              type: "passwordWithPolicy",
              InputProps: {
                fullWidth: true,
              },
            }}
          />
        </ButtonGroup>
        {!!value && value === values?.password && (
          <Stack direction="row" spacing={1} alignItems="center">
            <CheckCircleIcon fontSize="small" color="success" />
            <Typography color="success.main" variant="body2">
              Passwords match
            </Typography>
          </Stack>
        )}
      </Stack>
      <CopyLinkButton
        value={values?.password}
        variant="outlined"
        color="primary"
        label="password"
        sx={{ width: "200px" }}
        copiedText={"Password copied!"}
        startIcon={undefined}
      >
        Copy password
      </CopyLinkButton>
      <Typography color="textSecondary" variant="body2">
        Note: The password will not be accessible after you click "Save".
      </Typography>
    </Stack>
  );
};

const PasswordWithMatchField: FC<FieldComponentProps<FieldProps>> = (props) => {
  return (
    <FieldControl {...props} errors={undefined}>
      <UnControlledPasswordWithMatchField {...props} />
    </FieldControl>
  );
};

export default PasswordWithMatchField;
