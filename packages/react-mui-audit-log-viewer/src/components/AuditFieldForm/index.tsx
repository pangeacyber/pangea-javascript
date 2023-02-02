import { FC, useState, useEffect } from "react";
import get from "lodash/get";
import { Grid, TextField, Button, Stack } from "@mui/material";

import { AuditQuery } from "../../utils/query";
import { AuditRecordFields } from "../../utils/fields";

interface AuditFieldFormProps {
  queryObj: AuditQuery | null;
  onSearch: (query: Partial<AuditQuery>) => Promise<any>;
}

const AuditFieldForm: FC<AuditFieldFormProps> = ({ queryObj, onSearch }) => {
  const [values, setValues] = useState<Partial<AuditQuery>>(queryObj || {});

  const handleSubmit = () => {
    onSearch(values);
  };

  useEffect(() => {
    if (queryObj) setValues(queryObj);
  }, [queryObj]);

  return (
    <form
      onSubmit={(event) => {
        event.stopPropagation();
        event.preventDefault();
        handleSubmit();
      }}
      style={{ height: "100%" }}
    >
      <Stack spacing={1}>
        <Grid container spacing={1}>
          {Object.keys(AuditRecordFields).map((fieldName) => {
            const field = AuditRecordFields[fieldName];

            if (field.readonly) return null;

            return (
              <Grid xs={6} item key={`audit-field-${fieldName}`}>
                <TextField
                  value={get(values, fieldName, "")}
                  onChange={(event) => {
                    const newValue = event.target.value;
                    setValues((state) => ({
                      ...state,
                      [fieldName]: newValue,
                    }));
                  }}
                  label={field.label}
                  variant="outlined"
                  size="small"
                  sx={{
                    width: "100%",
                  }}
                />
              </Grid>
            );
          })}
        </Grid>
        <Button
          color="primary"
          variant="contained"
          type="submit"
          sx={{
            marginLeft: "auto!important",
            width: "fit-content",
          }}
        >
          Search
        </Button>
      </Stack>
    </form>
  );
};

export default AuditFieldForm;
