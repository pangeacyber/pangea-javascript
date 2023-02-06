import { Button, Divider, Stack, Typography } from "@mui/material";
import { FC } from "react";

interface Props {
  value?: string;
  onSelect: (range: string) => void;
}

const QuickTimeRanges: FC<Props> = ({ value, onSelect }) => {
  return (
    <Stack spacing={1}>
      <Typography color="textSecondary" variant="body2">
        Quick selections
      </Typography>
      <Stack direction="row" spacing={1}>
        <div>
          <Button
            color="info"
            variant={value === "1day" ? "contained" : "outlined"}
            onClick={() => onSelect("1day")}
          >
            1 day
          </Button>
        </div>
        <div>
          <Button
            color="info"
            variant={value === "7day" ? "contained" : "outlined"}
            onClick={() => onSelect("7day")}
          >
            7 days
          </Button>
        </div>
        <div>
          <Button
            color="info"
            variant={value === "30day" ? "contained" : "outlined"}
            onClick={() => onSelect("30day")}
          >
            30 days
          </Button>
        </div>
      </Stack>
    </Stack>
  );
};

export default QuickTimeRanges;
