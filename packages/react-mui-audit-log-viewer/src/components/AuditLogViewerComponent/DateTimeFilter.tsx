import { Stack, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { FC, ReactNode, useEffect, useState } from "react";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useAuditContext } from "../../hooks/context";
import { FieldFilter } from "../../types/query";

interface Props {
  value: any;
  field: string;
  children: ReactNode;
}

const DateTimeFilter: FC<Props> = ({ value, field, children }) => {
  const { setQueryObj } = useAuditContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const date = new Date(value);
  if (date.toString() === "Invalid Date") {
    return <>{children}</>;
  }

  const handleClickFilter = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    event.stopPropagation();
  };

  const handleCloseFilter = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    setAnchorEl(null);
  }, [setAnchorEl]);

  return (
    <Stack
      sx={{
        position: "relative",
        ".PangeaDateTime-Filter-Button": {
          opacity: 0,
        },
        "&:hover": {
          ".PangeaDateTime-Filter-Button": {
            opacity: 1,
          },
        },
        maxWidth: "100%",
      }}
      spacing={1}
      direction="row"
      alignItems="center"
      paddingRight={4}
    >
      {children}
      <>
        <IconButton
          className="PangeaDateTime-Filter-Button"
          data-testid="PangeaDateTime-Filter-Button"
          onClick={handleClickFilter}
          size="small"
          sx={{ position: "absolute", right: 0.5 }}
        >
          <AddCircleOutlineIcon color="info" sx={{ fontSize: "16px" }} />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleCloseFilter}
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <MenuItem
            onClick={() => {
              setQueryObj((state) => ({ ...state, [field]: `"${value}"` }));
              handleCloseFilter();
            }}
          >
            <Typography variant="body2">Filter for value</Typography>
          </MenuItem>
          <MenuItem
            onClick={() => {
              setQueryObj((state) => ({
                ...state,
                [field]: {
                  value: `"${value}"`,
                  operation: FieldFilter.LessThan,
                },
              }));
              handleCloseFilter();
            }}
          >
            <Typography variant="body2">Filter less than</Typography>
          </MenuItem>
          <MenuItem
            onClick={() => {
              setQueryObj((state) => ({
                ...state,
                [field]: {
                  value: `"${value}"`,
                  operation: FieldFilter.GreaterThan,
                },
              }));
              handleCloseFilter();
            }}
          >
            <Typography variant="body2">Filter greater than</Typography>
          </MenuItem>
        </Menu>
      </>
    </Stack>
  );
};

export default DateTimeFilter;
