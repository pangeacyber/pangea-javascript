import { FC } from "react";
import {
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";

export interface Props {
  label: string;
  value: string;
  actionLabel: string;
  actionCallback: () => void;
}

const IdField: FC<Props> = ({ label, value, actionLabel, actionCallback }) => {
  return (
    <FormControl variant="outlined" fullWidth>
      <InputLabel htmlFor="adornment">{label}</InputLabel>
      <OutlinedInput
        id="outlined-adornment-id"
        type="text"
        readOnly={true}
        endAdornment={
          <InputAdornment position="end">
            <Button onClick={actionCallback} color="secondary" size="small">
              <Typography variant="overline">{actionLabel}</Typography>
            </Button>
          </InputAdornment>
        }
        value={value}
        label={label}
      />
    </FormControl>
  );
};

export default IdField;
