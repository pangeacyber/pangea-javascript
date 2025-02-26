import { ButtonProps, Divider, IconButton, Tooltip } from "@mui/material";
import { FC } from "react";

import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";

export const RemoveButton: FC<ButtonProps> = (props) => {
  return (
    <Tooltip title="Remove">
      <IconButton {...props}>
        <RemoveCircleOutlineOutlinedIcon
          fontSize="small"
          color={props?.color ?? props.disabled ? undefined : "action"}
        />
      </IconButton>
    </Tooltip>
  );
};

const JoinDivider: FC = () => {
  return (
    <Divider
      sx={{
        borderColor: (theme) => theme.palette.divider,
        height: "8px",
        borderWidth: "1.5px",
      }}
      orientation="vertical"
    />
  );
};

export default JoinDivider;
