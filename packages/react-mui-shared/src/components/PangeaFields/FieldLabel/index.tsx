import { FC } from "react";
import startCase from "lodash/startCase";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Typography, Stack, Tooltip } from "@mui/material";

export interface LabelProps {
  variant?: "subtitle2" | "body2";
  color?: "secondary" | "primary";
  placement?: "top" | "start";
  info?: string;
}

interface Props extends LabelProps {
  label?: string;
  fieldName: string;
}

const FieldLabel: FC<Props> = ({
  variant = "body2",
  color = "primary",
  info,
  label,
  fieldName,
}) => {
  return (
    <Stack
      sx={{ minWidth: "130px" }}
      spacing={1}
      direction="row"
      alignItems="center"
    >
      <Typography color={`text${startCase(color)}`} component="span">
        <Stack
          direction="row"
          alignItems="center"
          textAlign="center"
          spacing={1}
        >
          <Typography variant={variant}>
            {label ?? startCase(fieldName)}
          </Typography>
          {info && (
            <Tooltip title={info}>
              <InfoOutlinedIcon
                fontSize="small"
                color={"inherit"}
                sx={{ marginTop: "2px!important" }}
              />
            </Tooltip>
          )}
        </Stack>
      </Typography>
    </Stack>
  );
};

export default FieldLabel;
