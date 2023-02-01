import { useState, forwardRef, useMemo, useRef, useEffect } from "react";
import find from "lodash/find";
import isEmpty from "lodash/isEmpty";
import startCase from "lodash/startCase";
import {
  Autocomplete,
  InputProps,
  TextField,
  ListItem,
  Typography,
} from "@mui/material";
import { determinedFocusedWordsOnCursorPosition } from "./utils";

export interface ConditionalOption {
  match: (current: string, previous: string) => boolean;
  options: { value: string; label: string }[];
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

    const { options: autocompleteOptions, currentPosition } = useMemo(() => {
      const { current, previous, currentPosition } =
        determinedFocusedWordsOnCursorPosition(value, cursor);

      return {
        options:
          find(options, (option) => option.match(current, previous))?.options ||
          [],
        currentPosition,
      };
    }, [value, cursor]);

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
        renderOption={(props, option) => {
          // @ts-ignore
          const optionValue: string = option;
          return (
            <ListItem {...props}>
              <Typography variant="body2">
                {startCase(optionValue.replace(":", ""))}
              </Typography>
            </ListItem>
          );
        }}
        renderInput={(params) => {
          return (
            <TextField
              ref={inputRef}
              {...params}
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
