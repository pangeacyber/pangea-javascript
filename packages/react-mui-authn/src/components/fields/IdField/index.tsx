import { FC } from "react";
import {
  Button,
  FormControl,
  InputAdornment,
  OutlinedInput,
  Typography,
} from "@mui/material";

export interface Props {
  value?: string;
  resetLabel?: string;
  resetCallback: () => void;
}

const IdField: FC<Props> = ({
  value,
  resetLabel = "Start over",
  resetCallback,
}) => {
  if (!value) {
    return null;
  }

  return (
    <FormControl variant="outlined" fullWidth>
      <OutlinedInput
        id="outlined-adornment-id"
        type="text"
        readOnly={true}
        endAdornment={
          <InputAdornment position="end">
            <Button
              onClick={resetCallback}
              color="secondary"
              size="small"
              disableElevation={true}
              sx={{
                height: "30px",
                marginRight: "-8px",
              }}
            >
              <Typography variant="overline">{resetLabel}</Typography>
            </Button>
          </InputAdornment>
        }
        value={value}
      />
    </FormControl>
  );
};

export default IdField;
