import { useColorScheme, useTheme } from "@mui/material/styles";
import { useState, useEffect, useRef } from "react";

function useDebounce(value: any, delay: any) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only re-call effect if value or delay changes
  );
  return debouncedValue;
}

export const useInternalState = (value: any, setValue: any) => {
  const [value_, setValue_] = useState(value);

  const debouncedValue = useDebounce(value_, 1000);

  const setValueRef = useRef(setValue);
  setValueRef.current = setValue;

  useEffect(() => {
    setValue_(value);
  }, [value]);

  useEffect(() => {
    if (debouncedValue === value_) setValueRef.current(debouncedValue);
  }, [debouncedValue]);

  return [value_, setValue_];
};

export const useMode = () => {
  const { mode } = useColorScheme();
  const theme = useTheme();

  return mode ?? theme.palette.mode;
};
