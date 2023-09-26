import { FC } from "react";
import { Stack, Typography } from "@mui/material";

import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import Button from "@src/components/core/Button";
import Disclaimer from "../../components/Disclaimer";
import { AuthOptions } from "../../components";

const SigninView: FC<AuthFlowComponentProps> = (props) => {
  const { options, data, reset } = props;

  return (
    <Stack gap={2}>
      <Typography variant="h6">{options.passwordHeading}</Typography>
      <Typography variant="body2" mb={1} sx={{ wordBreak: "break-word" }}>
        {data.email}
      </Typography>
      <AuthOptions {...props} />
      <Stack direction="row" justifyContent="center" gap={1}>
        <Button variant="text" onClick={reset}>
          {options.cancelLabel}
        </Button>
      </Stack>
      {/* {data.disclaimer && (<Disclaimer content={data.disclaimer}/>)} */}
    </Stack>
  );
};

export default SigninView;
