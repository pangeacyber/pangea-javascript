import React, { FC, useState, useEffect, useMemo } from "react";
import isEmpty from "lodash/isEmpty";
import keyBy from "lodash/keyBy";

import {
  Select,
  MenuItem,
  Typography,
  ListSubheader,
  TextField,
  InputAdornment,
  Stack,
  Tooltip,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";

import SearchIcon from "@mui/icons-material/Search";
import {
  FieldComponentProps,
  SelectFieldSchemaProps,
  ValueOptions,
} from "../types";
import FieldControl from "../FieldControl";

import { useValueOptions } from "../hooks/useValueOptions";

const CheckedListSubheader: FC<{
  children: React.ReactNode;
  onChecked: (checked: boolean) => void;
}> = ({ onChecked, children }) => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <ListSubheader
      sx={{
        cursor: "pointer",
      }}
      onClick={() => {
        setIsChecked(!isChecked);
        onChecked(!isChecked);
      }}
    >
      <Stack
        direction="row"
        sx={{
          alignItems: "center",
        }}
      >
        {isChecked ? (
          <CheckBoxIcon sx={{ marginRight: 1 }} fontSize="small" />
        ) : (
          <CheckBoxOutlineBlankIcon sx={{ marginRight: 1 }} fontSize="small" />
        )}
        {children}
      </Stack>
    </ListSubheader>
  );
};

export const containsText = (text: string, searchText: string): boolean =>
  text.toLowerCase().indexOf(searchText.toLowerCase()) > -1;

const getNextOption = (
  options: ValueOptions[],
  index: number
): ValueOptions | undefined => {
  const nextIndex = index + 1;
  if (nextIndex >= options.length) return undefined;

  return options[nextIndex];
};

const isOptionCategory = (
  option: ValueOptions,
  nextOption: ValueOptions | undefined,
  isSearching: boolean
): boolean => {
  return (
    typeof option === "object" &&
    option.type === "category" &&
    (!isSearching ||
      (!!nextOption && !isOptionCategory(nextOption, undefined, false)))
  );
};

const getLabel = (option: ValueOptions): string => {
  if (typeof option === "object") {
    // @ts-ignore
    const caption = option.caption ?? "";
    // @ts-ignore
    const description = option.description ?? "";

    return `${option.label} ${caption} ${description}`;
  }

  return `${option}`;
};

export type SelectFieldProps = FieldComponentProps<SelectFieldSchemaProps>;

export const UnControlledSelectField: FC<SelectFieldProps> = ({
  name = "",
  label,

  value,
  onValueChange = () => {},
  disabled,
  sx = {},

  errors,
  variant,
  size = "small",

  values,

  FieldProps,
}) => {
  const [searchText, setSearchText] = useState("");
  const {
    type,
    searchable,
    minSearchOptions = 15,
    CustomMenuItem = MenuItem,
    CustomValueEl,
    useLabelInValue = true,
    CaptionSx,
    SelectFieldProps,
    endAdornment = null,
    menuItems = null,
    autoSelectFirstOption = false,
  } = FieldProps ?? {};
  const isMulti = type === "multiSelect";

  const valueOptions = useValueOptions({
    values,
    options: FieldProps?.options,
  });
  const isSearchable = searchable && valueOptions.length >= minSearchOptions;

  let currentValues = value || (isMulti ? [] : (value ?? ""));

  const displayedOptions = useMemo(
    () =>
      valueOptions
        .filter((option, index) =>
          isSearchable
            ? isOptionCategory(option, undefined, false) ||
              containsText(getLabel(option), searchText)
            : true
        )
        .filter((option, index, array) =>
          isSearchable
            ? isOptionCategory(
                option,
                getNextOption(array, index),
                !!searchText
              ) || containsText(getLabel(option), searchText)
            : true
        ),
    [searchText, valueOptions, isSearchable]
  );

  useEffect(() => {
    if (valueOptions.length && autoSelectFirstOption) {
      const option = valueOptions[0];

      // @ts-ignore
      onValueChange(typeof option === "object" ? option.value : option);
    }
  }, [JSON.stringify(valueOptions), autoSelectFirstOption]);

  // @ts-ignore
  const width = sx?.width ?? "100%";
  return (
    <Stack width={width} direction="row">
      <Select
        key={name}
        id={name}
        name={name}
        value={currentValues}
        error={!isEmpty(errors)}
        size={size}
        onChange={(event) => {
          event.stopPropagation();
          event.preventDefault();

          let targetValue = event.target.value;
          onValueChange(targetValue);
        }}
        labelId={`field-${label}`}
        data-testid={`Select-Field-${name}`}
        fullWidth
        multiple={isMulti}
        disabled={disabled}
        variant={variant}
        renderValue={(value) => {
          const valueList = Array.isArray(value) ? value : [value];

          const valueOptionMap = keyBy(valueOptions, (o) => {
            if (typeof o === "object" && o.type === undefined) {
              return o.value;
            }

            return undefined;
          });

          const labels = valueList.map((value) => {
            if (!useLabelInValue) {
              return value;
            }
            const option = valueOptionMap[value] ?? {};

            // @ts-ignore
            return option?.label ?? value;
          });

          if (CustomValueEl) {
            return <CustomValueEl value={value} labels={labels} />;
          }

          return (
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography
                sx={{
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
                {...FieldProps?.ValueTypographyProps}
              >
                {labels.join(", ")}
              </Typography>
            </Stack>
          );
        }}
        sx={{
          ...(variant === "standard"
            ? {
                ":before": {
                  border: "none!important",
                },
                ":after": {
                  border: "none",
                },
              }
            : {}),
          ...sx,
        }}
        MenuProps={{
          autoFocus: isSearchable ? false : undefined,
          MenuListProps: {
            sx: {
              maxHeight: "600px",
            },
          },
        }}
        {...SelectFieldProps}
      >
        {isSearchable && (
          <ListSubheader key={`field-${label}-${value.label}-category`}>
            <TextField
              size="small"
              // Autofocus on textfield
              autoFocus
              placeholder="Type to search..."
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key !== "Escape") {
                  // Prevents autoselecting item while typing (default Select behaviour)
                  e.stopPropagation();
                }
              }}
              sx={{
                marginTop: 1,
                marginBottom: 2,
              }}
            />
          </ListSubheader>
        )}
        {displayedOptions.map((value, idx) => {
          if (typeof value === "object" && value.type === "category") {
            if (value.onChecked) {
              return (
                <CheckedListSubheader
                  key={`field-${idx}-category`}
                  onChecked={value.onChecked}
                >
                  {value.label}
                </CheckedListSubheader>
              );
            }

            return (
              <ListSubheader key={`field-${idx}-category`}>
                {value.label}
              </ListSubheader>
            );
          }

          let valObj: {
            valueIdentifier?: string;
            value?: any;
            label?: string;
            caption?: string;
            info?: string;
            disabled?: boolean;
            description?: string;
          } = {};
          if (typeof value !== "object") {
            valObj.value = value;
            valObj.label = `${value}`;
          } else {
            valObj = value;
          }

          return (
            <CustomMenuItem
              key={`field-${idx}-${valObj.value}-option`}
              disabled={valObj?.disabled === true}
              value={valObj.valueIdentifier || valObj.value}
              sx={{
                alignItems: "end",
                ".MenuItem-selected": {
                  display: "none",
                },
                "&.Mui-selected": {
                  ".MenuItem-selected": {
                    display: "block",
                  },
                  ".MenuItem-unselected": {
                    display: "none",
                  },
                },
              }}
            >
              <Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  {isMulti && (
                    <Stack>
                      <CheckBoxIcon
                        sx={{ marginRight: 1 }}
                        className="MenuItem-selected"
                        fontSize="small"
                      />
                      <CheckBoxOutlineBlankIcon
                        sx={{ marginRight: 1 }}
                        className="MenuItem-unselected"
                        fontSize="small"
                      />
                    </Stack>
                  )}
                  <Typography variant="body2">{valObj.label}</Typography>
                  {!!valObj.caption ? (
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      sx={{
                        ...(CaptionSx ?? {}),
                      }}
                    >
                      {valObj.caption}
                    </Typography>
                  ) : null}
                  {!!valObj.info ? (
                    <Tooltip title={valObj.info}>
                      <InfoOutlinedIcon fontSize="small" color="info" />
                    </Tooltip>
                  ) : null}
                </Stack>
                {!!valObj.description ? (
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{
                      maxWidth: "400px",
                      textWrap: "wrap",
                      ...(CaptionSx ?? {}),
                    }}
                  >
                    {valObj.description}
                  </Typography>
                ) : null}
              </Stack>
            </CustomMenuItem>
          );
        })}
        {menuItems}
      </Select>
      {endAdornment}
    </Stack>
  );
};

const SelectField: FC<SelectFieldProps> = (props) => {
  return (
    <FieldControl {...props}>
      <UnControlledSelectField {...props} />
    </FieldControl>
  );
};

export default SelectField;
