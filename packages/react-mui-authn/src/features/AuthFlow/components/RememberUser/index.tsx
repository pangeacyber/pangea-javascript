import { FC, useEffect, useState } from "react";
import { Checkbox, Stack, Typography } from "@mui/material";

import { STORAGE_REMEMBER_USERNAME_KEY } from "@src/features/AuthFlow/utils";
import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";

const RememberUser: FC<AuthFlowComponentProps> = ({ data }) => {
  const [checked, setChecked] = useState(false);
  const label = !!data?.conditionalMfa?.strict_mode
    ? "device and location"
    : "device";

  useEffect(() => {
    // if a device_id exists in localStorage, auto-check the checkbox
    if (localStorage.getItem(STORAGE_REMEMBER_USERNAME_KEY)) {
      setChecked(true);
    }
  }, []);

  useEffect(() => {
    if (checked) {
      localStorage.setItem(STORAGE_REMEMBER_USERNAME_KEY, data?.email || "");
    } else {
      localStorage.removeItem(STORAGE_REMEMBER_USERNAME_KEY);
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
        inputProps={{ "aria-label": "controlled" }}
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
