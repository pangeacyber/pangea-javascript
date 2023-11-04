import { FC } from "react";
import { Stack, Typography } from "@mui/material";
import IdField from "@src/components/fields/IdField";
import Disclaimer from "../../components/Disclaimer";

interface Props {
  title?: string;
  disclaimer?: string;
  buttons?: JSX.Element;
}

const AuthFlowLayout: FC<Props> = ({
  title,
  disclaimer,
  buttons,
  children,
}) => {
  return (
    <Stack gap={2}>
      {title && <Typography variant="h6">{title}</Typography>}
      <Stack gap={1}>{children}</Stack>
      {buttons && (
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="center"
          gap={{ xs: 0, sm: 1 }}
        >
          {buttons}
        </Stack>
      )}
      {disclaimer && <Disclaimer content={disclaimer} />}
    </Stack>
  );
};

export default AuthFlowLayout;
