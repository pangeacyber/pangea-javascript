import {
  ButtonProps,
  Chip,
  ChipProps,
  Container,
  Divider,
  Stack,
} from "@mui/material";
import React, { FC, ReactNode } from "react";
import JoinDivider from "./JoinDivider";
import {
  SelectField,
  UnControlledSelectField,
} from "@pangeacyber/react-mui-shared";
import { lighten } from "@mui/material/styles";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

interface Props {
  value: string;
  onValueChange: (value: string) => void;
}

const QUERY_OPERATION_OPTIONS = [
  {
    value: "OR",
    label: "OR",
  },
  {
    value: "AND",
    label: "AND",
  },
];

const JoinChip: FC<Props> = ({ value, onValueChange, ...props }) => {
  return (
    <Stack alignItems="center">
      <JoinDivider />
      <Stack width="60px">
        <UnControlledSelectField
          value={value}
          onValueChange={onValueChange}
          size="small"
          variant="outlined"
          sx={{
            padding: "0px!important",
            ".MuiOutlinedInput-root": {},
            ".MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
            ".MuiSelect-select": {
              paddingY: 0,
              padding: "0!important",
            },
          }}
          FieldProps={{
            type: "singleSelect",
            options: {
              valueOptions: QUERY_OPERATION_OPTIONS,
            },
            SelectFieldProps: {
              // @ts-ignore
              IconComponent: null,
              renderValue: (value) => {
                return (
                  <Chip
                    label={value}
                    size="small"
                    deleteIcon={
                      <ArrowDropDownIcon
                        sx={{
                          color: (theme) =>
                            `${theme.palette.secondary.contrastText}!important`,
                        }}
                        fontSize="small"
                      />
                    }
                    onDelete={() => {}}
                    sx={{
                      margin: "auto!important",
                      width: "100%",
                      alignSelf: "center",
                      backgroundColor: (theme) => theme.palette.secondary.main,
                      color: (theme) => theme.palette.secondary.contrastText,
                      ":hover": {
                        backgroundColor: (theme) =>
                          lighten(theme.palette.secondary.main, 0.2),
                      },
                    }}
                  />
                );
              },
            },
          }}
        />
      </Stack>
      <JoinDivider />
    </Stack>
  );
};

export default JoinChip;
