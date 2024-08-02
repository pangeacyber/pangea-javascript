import { Stack, TextField } from "@mui/material";
import React, { FC, useRef, useState, useEffect, useMemo } from "react";

interface CodeInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onFinish: () => void;
  disabled?: boolean;
}

const CodeInput: FC<CodeInputProps> = ({
  length = 6,
  value,
  onChange,
  onFinish,
  disabled = false,
}) => {
  const [values, setValues] = useState<Record<number, string>>({});
  const inputRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const inputs = Array(0, 1, 2, 3, 4, 5);

  useEffect(() => {
    if (value === "") {
      // set value to empty
      inputs.map((inputId) => {
        setValues((state) => ({
          ...state,
          [inputId]: "",
        }));
      });
      inputRefs.current[0]?.focus();
    }
  }, [value]);

  useEffect(() => {
    const newValue = Object.keys(values)
      .sort((a, b) => {
        // @ts-ignore
        return a - b;
      })
      .map((inputId) => {
        // @ts-ignore
        return values[inputId] ?? "";
      })
      .join("");

    if (newValue !== value) onChange(newValue);
  }, [values]);

  const inputName = useMemo(() => {
    return Math.random()
      .toString(36)
      .replace(/[^a-z0-9]/g, "");
  }, []);

  const getInputs = (
    inputId: number
  ): {
    previousInput: HTMLDivElement | null;
    nextInput: HTMLDivElement | null;
  } => {
    const nextId = Math.min(inputId + 1, length - 1);
    const previousId = Math.max(inputId - 1, 0);

    const previousInput = inputRefs.current[previousId];
    const nextInput = inputRefs.current[nextId];

    return { previousInput, nextInput };
  };

  const handleChange = (
    inputId: number,
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { nextInput } = getInputs(inputId);

    // Only support numbers;
    const newValue = `${e.target.value}`.replace(/[^\d]/g, "").split("").pop();
    if (!newValue) return;

    setValues((state) => ({
      ...state,
      [inputId]: newValue,
    }));
    nextInput?.focus();
    e.preventDefault();
  };

  const handleKeyDown = (
    inputId: number,
    e: React.KeyboardEvent<HTMLDivElement>
  ) => {
    const { previousInput, nextInput } = getInputs(inputId);

    switch (e.key) {
      case "Backspace":
        e.preventDefault();
        setValues((state) => ({
          ...state,
          [inputId]: "",
        }));
        previousInput?.focus();
        break;
      case "ArrowLeft":
        e.preventDefault();
        previousInput?.focus();
        break;
      case "ArrowRight":
        e.preventDefault();
        nextInput?.focus();
        break;
      case "Enter":
        e.preventDefault();
        if (inputId === inputs.length - 1) {
          if (Object.values(values).filter((v) => !!v).length === length)
            onFinish();
        } else {
          nextInput?.focus();
        }
        break;
      default:
        break;
    }
  };

  const handleKeyUp = () => {
    if (Object.values(values).filter((v) => !!v).length === length) {
      onFinish();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const clip = e.clipboardData.getData("text");
    if (!/\d{6}/.test(clip)) return;
    e.preventDefault();

    const s = clip.split("");
    inputs.map((inputId, idx) => {
      setValues((state) => ({
        ...state,
        [inputId]: s[idx],
      }));
    });
    const { nextInput } = getInputs(length - 2);
    nextInput?.focus();
  };

  return (
    <Stack spacing={0.5} direction="row" alignItems="center">
      {inputs.map((inputId) => {
        return (
          <TextField
            className="otp-input"
            inputRef={(ref) => {
              inputRefs.current[inputId] = ref;
            }}
            name={`otp-input-${inputName}`}
            inputProps={{
              autoComplete: "one-time-code",
              inputMode: "numeric",
              form: {
                autoComplete: "one-time-code",
              },
            }}
            sx={{
              marginTop: 0,
              ".MuiOutlinedInput-root": {
                width: "52px",
                height: "72px",
              },
              input: {
                fontWeight: 600,
                fontSize: "42px",
                textAlign: "center",
                padding: 0,
              },
            }}
            autoFocus={inputId === 0}
            value={values[inputId] || ""}
            key={`code-input-${inputId}`}
            onKeyUp={() => handleKeyUp()}
            onKeyDown={(e) => handleKeyDown(inputId, e)}
            onChange={(e) => handleChange(inputId, e)}
            onPaste={(e) => handlePaste(e)}
            disabled={disabled}
          />
        );
      })}
    </Stack>
  );
};

export default CodeInput;
