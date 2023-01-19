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
            variant={value === "1d" ? "contained" : "outlined"}
            onClick={() => onSelect("1d")}
          >
            1 day
          </Button>
        </div>
        <div>
          <Button
            color="info"
            variant={value === "7d" ? "contained" : "outlined"}
            onClick={() => onSelect("7d")}
          >
            7 days
          </Button>
        </div>
        <div>
          <Button
            color="info"
            variant={value === "30d" ? "contained" : "outlined"}
            onClick={() => onSelect("30d")}
          >
            30 days
          </Button>
        </div>
      </Stack>
    </Stack>
  );
};

export default QuickTimeRanges;
