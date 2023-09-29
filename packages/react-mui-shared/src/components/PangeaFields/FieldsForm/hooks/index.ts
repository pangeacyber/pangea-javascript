import { useMediaQuery } from "@mui/material";
import { Breakpoint, useTheme } from "@mui/material/styles";

export const useBreakpoint = (breakpoint: Breakpoint) => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down(breakpoint));
};
