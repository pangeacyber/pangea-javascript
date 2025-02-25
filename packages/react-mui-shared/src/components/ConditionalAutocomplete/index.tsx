import { useState, forwardRef, useMemo, useRef, useEffect, FC } from "react";
import find from "lodash/find";
import isEmpty from "lodash/isEmpty";
import keyBy from "lodash/keyBy";

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
import AutocompleteOptionComponent, {
  OptionComponentProps,
} from "./AutocompleteOptionComponent";
import { ConditionalOption } from "./types";

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

  OptionComponent?: FC<OptionComponentProps>;
}

const HelperText: FC<{ error: any }> = ({ error }) => {
  if (!error) {
    return null;
  }

  if (!!error && typeof error === "string") {
    return (
      <Stack
        sx={{
          userSelect: "auto",
          paddingY: 0.5,
          paddingX: 1,
        }}
      >
        <Typography color="error" variant="caption" sx={{ userSelect: "auto" }}>
          {error.split(" ").map((e, i) => {
            if (e.startsWith("https://")) {
              return (
                <>
                  <a href={e} target="blank_" style={{ color: "inherit" }}>
                    {e}
                  </a>
                  <span> </span>
                </>
              );
            }
            return <span key={`auto-error-${i}`}>{e} </span>;
          })}
        </Typography>
      </Stack>
    );
  }

  return error;
};

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

      OptionComponent = AutocompleteOptionComponent,
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
      <Stack sx={{ flexGrow: 1 }}>
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
          renderOption={(props, option) => (
            <OptionComponent
              props={props}
              option={option}
              options={optionsMap}
            />
          )}
          renderInput={(params) => {
            return (
              <TextField
                ref={inputRef}
                {...params}
                error={!!error}
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
        <HelperText error={error} />
      </Stack>
    );
  }
);
ConditionalAutocomplete.displayName = "ConditionalAutocomplete";

export default ConditionalAutocomplete;
