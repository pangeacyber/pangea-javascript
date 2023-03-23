import { FC, Fragment, ReactNode } from "react";
import { Tooltip, Stack, Divider, Typography } from "@mui/material";

interface ListValueObj {
  label: string;
  caption: string;
}

type ListValue = string | ListValueObj;

interface ListTooltipProps {
  data: ListValue[];
  children: ReactNode;
}

const ListTooltip: FC<ListTooltipProps> = ({ children, data }) => {
  return (
    <Tooltip
      title={
        <Stack
          spacing={1}
          sx={{
            overflowY: "auto",
            overflowX: "hidden",
            maxHeight: "400px",
            padding: "4px",
          }}
        >
          {data.map((i, idx) => {
            const isObj = typeof i === "object";
            const label = isObj ? i.label : i;

            return (
              <Fragment key={`list-cell-${idx}`}>
                {idx !== 0 && <Divider />}
                <Stack>
                  <Typography variant="body2">{label}</Typography>
                  {isObj && !!i.caption && (
                    <Typography variant="body2" color="textSecondary">
                      {i.caption}
                    </Typography>
                  )}
                </Stack>
              </Fragment>
            );
          })}
        </Stack>
      }
      PopperProps={{
        sx: {
          ".MuiTooltip-tooltip": {
            color: "text.primary",
            boxShadow: "0px 0px 24px rgba(40, 48, 94, 0.12)",
          },
        },
      }}
    >
      <span>{children}</span>
    </Tooltip>
  );
};

export default ListTooltip;
