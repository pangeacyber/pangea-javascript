import { Button, ButtonProps, Stack, Typography } from "@mui/material";
import { FC, useMemo } from "react";
import { TimeRangeString } from "../RelativeDateRangeField/types";
import { getDisplayDateRange } from "../RelativeDateRangeField/utils";

export const DEFAULT_QUICK_TIME_RANGES = ["1day", "7day", "30day"];

interface QuickTimeRangeButtonProps extends ButtonProps {
  range: TimeRangeString;

  value?: TimeRangeString;
  onSelectValue?: (range: TimeRangeString) => void;
}

const QuickTimeRangeButton: FC<QuickTimeRangeButtonProps> = ({
  range,
  value,
  onSelectValue,
  ...ButtonProps
}) => {
  const label = useMemo(() => {
    return getDisplayDateRange(range);
  }, [range]);

  return (
    <Button
      color="info"
      variant={value === range ? "contained" : "outlined"}
      onClick={() => !!onSelectValue && onSelectValue(range)}
      {...ButtonProps}
    >
      {label}
    </Button>
  );
};

interface Props {
  value?: string;
  onSelect: (range: string) => void;

  ranges?: TimeRangeString[];
}

const QuickTimeRanges: FC<Props> = ({
  value,
  onSelect,
  ranges = DEFAULT_QUICK_TIME_RANGES,
}) => {
  if (!ranges?.length) return null;
  return (
    <Stack spacing={1}>
      <Typography color="textSecondary" variant="body2">
        Quick selections
      </Typography>
      <Stack direction="row" spacing={1}>
        {ranges?.map((range, idx) => (
          <div key={`quick-time-duration-${range}-${idx}`}>
            <QuickTimeRangeButton
              range={range}
              value={value}
              onSelectValue={onSelect}
            />
          </div>
        ))}
      </Stack>
    </Stack>
  );
};

export default QuickTimeRanges;
