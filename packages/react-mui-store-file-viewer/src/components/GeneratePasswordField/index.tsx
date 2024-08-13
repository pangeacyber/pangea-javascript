import { FC, useState } from "react";
import { Button, ButtonGroup, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  AuthPasswordField,
  FieldComponentProps,
  FieldControl,
} from "@pangeacyber/react-mui-shared";

import {
  useCreateShareContext,
  useStoreFileViewerContext,
} from "../../hooks/context";
import { passwordGenerator, checkPassword } from "../../utils";

interface FieldProps {
  disabled: boolean;
  errorCallback?: (error: boolean) => void;
}

const UnControlledGeneratePasswordField: FC<
  FieldComponentProps<FieldProps>
> = ({ onValueChange, ...props }) => {
  const { configurations } = useStoreFileViewerContext();
  const { errors, password, setPassword } = useCreateShareContext();
  const theme = useTheme();
  const onError = props?.FieldProps?.errorCallback;
  const disabled = props?.FieldProps?.disabled || false;
  const [error, setError] = useState<boolean>();

  const handleValueChange = (value: string) => {
    const isValid = checkPassword(value, configurations?.passwordPolicy);
    setError(!isValid);
    if (onError) {
      onError(!isValid);
    }
    if (onValueChange) {
      onValueChange(value);
    }
    setPassword(value);
  };

  return (
    <Stack gap={0.5}>
      <ButtonGroup
        sx={{
          flexGrow: 1,
          width: "100%",
          ".MuiFormGroup-root": {
            width: "calc(100% - 140px)",
          },
          ".MuiPopper-root": {
            zIndex: theme.zIndex.modal + 1,
          },
        }}
      >
        <AuthPasswordField
          {...props}
          value={password || ""}
          onValueChange={handleValueChange}
          disabled={disabled}
          FieldProps={{
            ...props?.FieldProps,
            type: "passwordWithPolicy",
            policy: configurations?.passwordPolicy ?? {
              chars_min: 8,
            },
            InputProps: {
              fullWidth: true,
              sx: {
                borderBottomRightRadius: "0!important",
                borderTopRightRadius: "0!important",
              },
            },
          }}
        />
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            handleValueChange(passwordGenerator(10));
          }}
          disabled={disabled}
          sx={{
            color: theme.palette.primary.main,
            borderBottomLeftRadius: "0!important",
            borderTopLeftRadius: "0!important",
            boxShadow: "none",
            zIndex: 0,
            flex: 1,
          }}
        >
          Suggest
        </Button>
      </ButtonGroup>
      {(error || !!errors?.password) && (
        <Typography variant="caption" color="error" ml={1}>
          {!!errors?.password || "Password does not meet requirements"}
        </Typography>
      )}
    </Stack>
  );
};

const GeneratePasswordField: FC<FieldComponentProps> = (props) => {
  return (
    <FieldControl {...props}>
      {/* @ts-ignore */}
      <UnControlledGeneratePasswordField {...props} />
    </FieldControl>
  );
};

export default GeneratePasswordField;
