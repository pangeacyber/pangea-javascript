import { Button, ButtonGroup, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  AuthPasswordField,
  FieldComponentProps,
  FieldControl,
} from "@pangeacyber/react-mui-shared";
import { FC } from "react";

import { useStoreFileViewerContext } from "../../hooks/context";
import { passwordGenerator } from "../../utils";

interface FieldProps {
  options?: {
    valueOptions?: string[];
  };
}

const UnControlledPasswordWithGenerateField: FC<
  FieldComponentProps<FieldProps>
> = ({ onValueChange, ...props }) => {
  const theme = useTheme();
  const { configurations } = useStoreFileViewerContext();

  const value: string = props.value;

  return (
    <Stack spacing={0.5}>
      <Stack width="100%">
        <ButtonGroup
          sx={{
            flexGrow: 1,
            width: "100%",
            ".MuiFormGroup-root": {
              width: "calc(100% - 170px)",
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
            onClick={() =>
              !!onValueChange && onValueChange(passwordGenerator(10))
            }
            sx={{
              color: theme.palette.primary.main,
              borderBottomLeftRadius: "0!important",
              borderTopLeftRadius: "0!important",
              boxShadow: "none",
              zIndex: 0,
              flex: 1,
            }}
          >
            Generate password
          </Button>
        </ButtonGroup>
      </Stack>
    </Stack>
  );
};

const PasswordWithGenerateField: FC<FieldComponentProps<FieldProps>> = (
  props
) => {
  return (
    <FieldControl {...props} errors={undefined}>
      <UnControlledPasswordWithGenerateField {...props} />
    </FieldControl>
  );
};

export default PasswordWithGenerateField;
