import { useState, forwardRef, useMemo, useRef, useEffect } from "react";
import find from "lodash/find";
import isEmpty from "lodash/isEmpty";
import startCase from "lodash/startCase";
import keyBy from "lodash/keyBy";
import get from "lodash/get";

import {
  Autocomplete,
  InputProps,
  TextField,
  ListItem,
  Typography,
  Stack,
} from "@mui/material";
import { determinedFocusedWordsOnCursorPosition } from "./utils";
import { safeStringify } from "../../utils";

export interface ConditionalOption {
  match: (current: string, previous: string) => boolean;
  options: { value: string; label: string; caption?: string }[];
}

interface ConditionalAutocompleteProps {
  value: any;
  onChange: (value: any) => void;
  options: ConditionalOption[];
  size?: "small" | "medium";
  InputProps?: InputProps;
  placeholder?: string;
  hideMenu?: boolean;
  onOpen?: (open: boolean) => void;
  error?: string;
}

/**
 * ConditionalAutocomplete is a wrapper around MUI Autocomplete to allow or conditional options.
 *
 * Conditional options allows users to provide a match function that can work off of the currently
 *  viewed word along with the previous word to determine whether or not those options should be set on
 *  Autocomplete. Letting the users autocomplete
 */
const ConditionalAutocomplete = forwardRef<any, ConditionalAutocompleteProps>(
  (
    {
      value,
      onChange,
      size = "small",
      InputProps = {},
      options,
      placeholder,
      onOpen,
      hideMenu,
      error,
    },
    ref
  ) => {
    const inputRef = useRef(null);
    const [cursor, setCursor] = useState(0);
    const [open, setOpen_] = useState(false);

    const setOpen = (open: boolean) => {
      if (!!onOpen) onOpen(open);
      setOpen_(open);
    };

    useEffect(() => {
      if (hideMenu) setOpen_(false);
    }, [hideMenu]);

    const {
      options: autocompleteOptions,
      optionsMap,
      currentPosition,
      current,
    } = useMemo(() => {
      const { current, previous, currentPosition } =
        determinedFocusedWordsOnCursorPosition(value, cursor);

      const options_ =
        find(options, (option) => option.match(current, previous))?.options ||
        [];

      return {
        options: options_,
        currentPosition,
        optionsMap: keyBy(options_, "value"),
        current,
      };
    }, [value, cursor, safeStringify(options)]);

    useEffect(() => {
      setOpen(!!cursor && !isEmpty(autocompleteOptions));
    }, [autocompleteOptions.length]);

    return (
      <Autocomplete
        ref={ref}
        id="smart-auto-complete"
        freeSolo
        options={autocompleteOptions.map((option) => option.value)}
        open={open}
        onClose={(e) => {
          setOpen(false);
        }}
        size={size}
        value={value}
        onSelect={(e) => {
          if ("selectionStart" in e.target) {
            // @ts-ignore selectionStart is type guarded
            setCursor(e.target.selectionStart);
            setOpen(!isEmpty(autocompleteOptions));
          }
        }}
        onChange={(_, autoCompleteValue) => {
          const start = value.substring(0, currentPosition[0] ?? 0);
          const end = value.substring(currentPosition[1] ?? 0);
          onChange(`${start}${autoCompleteValue}${end}`);
          setOpen(false);
        }}
        sx={{
          flexGrow: 1,
        }}
        filterOptions={(options, state) => {
          const displayOptions = options.filter((option) =>
            option.toLowerCase().trim().includes(current.toLowerCase().trim())
          );

          return displayOptions;
        }}
        renderOption={(props, option) => {
          // @ts-ignore
          const optionValue: string = option;
          return (
            <ListItem {...props}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="body2">
                  {startCase(optionValue.replace(":", ""))}
                </Typography>
                {!!get(optionsMap, optionValue, { value: undefined }).value && (
                  <Typography variant="body2" color="textSecondary">
                    {optionsMap[optionValue].value.replace(":", "")}
                  </Typography>
                )}
              </Stack>
            </ListItem>
          );
        }}
        renderInput={(params) => {
          return (
            <TextField
              ref={inputRef}
              {...params}
              error={!!error}
              helperText={error}
              placeholder={placeholder}
              InputProps={{
                ...params?.InputProps,
                ...InputProps,
                onChange: (e) => {
                  onChange(e.target.value);
                  setOpen(!isEmpty(autocompleteOptions));
                },
              }}
            />
          );
        }}
      />
    );
  }
);
ConditionalAutocomplete.displayName = "ConditionalAutocomplete";

export default ConditionalAutocomplete;
