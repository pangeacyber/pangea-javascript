import React, { FC, useState } from "react";

import { Grid2 as Grid, Typography, Collapse } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { FormObject, GenericGroupedFields } from "../types";

const FieldGrouping: FC<{
  label: string;
  metadata?: GenericGroupedFields<FormObject>;
  defaultOpen?: boolean;
  spacing?: number;
  values?: FormObject;
  children?: React.ReactNode;
}> = ({ label, metadata, defaultOpen, children, values = {}, spacing = 2 }) => {
  const theme = useTheme();
  const [open, setOpen] = useState(
    defaultOpen ?? metadata?.defaultOpen ?? true
  );

  const collaspable = metadata?.collaspable ?? true;

  if (!label) return <>{children}</>;

  if (metadata?.isHidden && metadata.isHidden(values)) {
    return null;
  }

  return (
    <>
      {metadata?.hideLabel !== true && (
        <Grid
          width="100%"
          sx={
            collaspable
              ? {
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  padding: "8px!important",
                  borderRadius: 1,
                  marginTop: 1,
                  paddingLeft: "0px!important",
                  marginLeft: 1,
                }
              : {}
          }
          onClick={() => setOpen(!open)}
        >
          {collaspable && (
            <>
              {open ? (
                <KeyboardArrowDownIcon fontSize="small" />
              ) : (
                <KeyboardArrowRightIcon fontSize="small" />
              )}
            </>
          )}
          <Typography
            variant="subtitle2"
            sx={{ marginLeft: collaspable ? 1 : 0 }}
          >
            {label}
          </Typography>
          {metadata?.renderControls && metadata.renderControls(values)}
        </Grid>
      )}
      {!!collaspable ? (
        <Grid width="100%">
          <Collapse in={open}>
            <Grid container spacing={1}>
              {children}
            </Grid>
          </Collapse>
        </Grid>
      ) : (
        <>{children}</>
      )}
    </>
  );
};

export default FieldGrouping;
