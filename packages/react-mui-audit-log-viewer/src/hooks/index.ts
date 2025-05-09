import { useColorScheme, useTheme } from "@mui/material";

export const useMode = () => {
  const { mode } = useColorScheme();
  const theme = useTheme();

  return mode ?? theme.palette.mode;
};
