import { FC, Fragment } from "react";
import { Tooltip, Typography, Stack, Divider, Chip } from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface ListCellProps {
  value: string[];
  name: string;
  cutoff?: number;
  useFlexibleCutoff?: boolean;
}

interface ListCellValueObject {
  label: string;
  caption: string;
}

type ListCellValue = string | ListCellValueObject;

interface ListCellTooltipProps {
  children: React.ReactNode;
  data: ListCellValue[];
  cutoff?: number;
}

const ListCellTooltip: FC<ListCellTooltipProps> = ({
  children,
  data,
  cutoff = 3,
}) => {
  return (
    <Tooltip
      title={
        <Stack
          spacing={1}
          sx={{
            overflowY: "auto",
            overflowX: "hidden",
            maxHeight: "400px",
            paddingRight: 1,
            marginRight: -1,
          }}
        >
          {data.slice(cutoff).map((i, idx) => {
            const isObj = typeof i === "object";
            const label = isObj ? i.label : i;

            return (
              <Fragment key={`list-cell-${idx}`}>
                {idx !== 0 && <Divider />}
                <Stack>
                  <Typography variant="body2">{label}</Typography>
                  {isObj && (
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
            bgcolor: "white",
            boxShadow: "0px 0px 24px rgba(40, 48, 94, 0.12)",
          },
        },
      }}
    >
      <span>{children}</span>
    </Tooltip>
  );
};

const ListCell: FC<ListCellProps> = ({
  value,
  name,
  cutoff = 3,
  useFlexibleCutoff = true,
}) => {
  const theme = useTheme();
  if (!Array.isArray(value)) return null;

  const values: ListCellValue[] = value.filter((v: any): boolean => {
    const label = typeof v === "string" ? v : v?.label;
    return typeof label === "string";
  });

  const cutoff_ =
    useFlexibleCutoff && values.length - 1 === cutoff ? values.length : cutoff;
  const overflowCount = values.length - cutoff_;

  return (
    <Stack
      direction="row"
      spacing={0.5}
      sx={{ overflowX: "auto", overflowY: "hidden" }}
    >
      {values.slice(0, cutoff_).map((v, i) => {
        const label = typeof v === "string" ? v : v?.label;
        return (
          <Chip
            size="small"
            key={`${name}-chip-${v}-${i}`}
            sx={{
              color: "text.secondary",
              backgroundColor: `${theme.palette.secondary.light}`,
            }}
            label={label}
          />
        );
      })}
      {overflowCount > 0 && (
        <ListCellTooltip data={values} cutoff={cutoff_}>
          <Chip
            size="small"
            sx={{
              color: "text.secondary",
              backgroundColor: `${theme.palette.secondary.light}`,
            }}
            label={`+${overflowCount} more`}
          />
        </ListCellTooltip>
      )}
    </Stack>
  );
};

export default ListCell;
