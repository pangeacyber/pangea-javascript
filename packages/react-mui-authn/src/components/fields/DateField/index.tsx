import { FC, useEffect, useState } from "react";
import { Stack, Typography } from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";

export interface Props {
  name: string;
  label: string;
  formik: any;
}

const DateField: FC<Props> = ({ name, label, formik }) => {
  const [value, setValue] = useState<Dayjs | null>(dayjs());

  const handleChange = (newDate: Dayjs | null) => {
    setValue(newDate);
    formik.setFieldValue(name, newDate?.toISOString());
  };

  useEffect(() => {
    formik.setFieldValue(name, value?.toISOString());
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["DatePicker"]} sx={{ paddingTop: "0" }}>
        <Stack width="100%" gap={0.5} alignItems="flex-start">
          <Typography
            variant="body2"
            sx={{ textAlign: "left", fontSize: "0.75em", fontWeight: "500" }}
          >
            {label}
          </Typography>
          <DatePicker
            value={value}
            onChange={(newValue) => handleChange(newValue)}
            sx={{ width: "100%" }}
          />
        </Stack>
      </DemoContainer>
    </LocalizationProvider>
  );
};

export default DateField;
