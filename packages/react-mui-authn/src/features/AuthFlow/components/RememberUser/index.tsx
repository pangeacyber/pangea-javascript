import { FC, useEffect, useState } from "react";
import { Checkbox, Stack, Typography } from "@mui/material";

import {
  STORAGE_REMEMBER_USERNAME_KEY,
  STORAGE_REMEMBER_UNCHECKED_KEY,
} from "@src/features/AuthFlow/utils";
import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";

const RememberUser: FC<AuthFlowComponentProps> = ({ data }) => {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // if a device_id exists in localStorage, auto-check the checkbox
    if (
      localStorage.getItem(STORAGE_REMEMBER_USERNAME_KEY) ||
      (data.rememberUser === "check" &&
        !localStorage.getItem(STORAGE_REMEMBER_UNCHECKED_KEY))
    ) {
      setChecked(true);
    }
  }, []);

  useEffect(() => {
    if (checked) {
      localStorage.setItem(STORAGE_REMEMBER_USERNAME_KEY, data?.email || "");
      localStorage.removeItem(STORAGE_REMEMBER_UNCHECKED_KEY);
    } else {
      localStorage.removeItem(STORAGE_REMEMBER_USERNAME_KEY);
      localStorage.setItem(STORAGE_REMEMBER_UNCHECKED_KEY, "1");
    }
  }, [checked]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked);
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="left"
      sx={{
        "& p": {
          whiteSpace: "nowrap",
        },
      }}
    >
      <Checkbox
        checked={checked}
        onChange={handleChange}
        slotProps={{
          input: {
            "aria-label": "controlled",
          },
        }}
        disableRipple
        sx={{
          marginLeft: "-12px",
          "& input": {
            height: "100%",
          },
        }}
      />
      <Typography variant="body2">Remember username</Typography>
    </Stack>
  );
};

export default RememberUser;
