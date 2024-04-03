import { FC, useEffect, useMemo, useState } from "react";
import { Checkbox, Stack } from "@mui/material";

import { STORAGE_DEVICE_ID_KEY } from "@src/features/AuthFlow/utils";
import { generateGuid } from "@src/features/AuthFlow/utils";
import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import { BodyText } from "@src/components/core/Text";

const RememberDevice: FC<AuthFlowComponentProps> = ({ data }) => {
  const [checked, setChecked] = useState(false);
  const label = data?.conditionalMfa?.strict_mode
    ? "device"
    : "device and location";

  useEffect(() => {
    sessionStorage.removeItem(STORAGE_DEVICE_ID_KEY);
  }, []);

  const deviceId = useMemo(() => {
    return generateGuid();
  }, []);

  const handleClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked);

    if (e.target.checked) {
      sessionStorage.setItem(STORAGE_DEVICE_ID_KEY, deviceId);
    } else {
      sessionStorage.removeItem(STORAGE_DEVICE_ID_KEY);
    }
  };

  return (
    <Stack direction="row" alignItems="center" justifyContent="center">
      <Checkbox checked={checked} onChange={handleClick} />
      <BodyText>
        Remember this {label} for {data?.conditionalMfa?.lifetime} days
      </BodyText>
    </Stack>
  );
};

export default RememberDevice;
