import { FC } from "react";
import {
  Button,
  FormControl,
  InputAdornment,
  OutlinedInput,
  Typography,
} from "@mui/material";

import { STORAGE_REMEMBER_USERNAME_KEY } from "@src/features/AuthFlow/utils";

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
  const clickHandler = () => {
    // remove the stored username on reset
    localStorage.removeItem(STORAGE_REMEMBER_USERNAME_KEY);
    resetCallback();
  };

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
              onClick={clickHandler}
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
