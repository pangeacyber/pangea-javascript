import { FC, useEffect, useMemo, useState } from "react";
import { Checkbox, Stack } from "@mui/material";

import { STORAGE_DEVICE_ID_KEY } from "@src/features/AuthFlow/utils";
import { generateGuid } from "@src/features/AuthFlow/utils";
import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import { BodyText } from "@src/components/core/Text";

const RememberDevice: FC<AuthFlowComponentProps> = ({ data }) => {
  const [checked, setChecked] = useState(false);
  const label = !!data?.conditionalMfa?.strict_mode
    ? "device and location"
    : "device";

  useEffect(() => {
    // if a device_id exists in localStorage, auto-check the checkbox
    if (localStorage.getItem(STORAGE_DEVICE_ID_KEY)) {
      setChecked(true);
    }
  }, []);

  useEffect(() => {
    if (checked) {
      sessionStorage.setItem(STORAGE_DEVICE_ID_KEY, deviceId);
    } else {
      sessionStorage.removeItem(STORAGE_DEVICE_ID_KEY);
    }
  }, [checked]);

  const deviceId = useMemo(() => {
    return generateGuid();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked);
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
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
        sx={{
          "& input": {
            height: "100%",
          },
        }}
      />
      <BodyText>
        Remember this {label} for {data?.conditionalMfa?.lifetime} days
      </BodyText>
    </Stack>
  );
};

export default RememberDevice;
