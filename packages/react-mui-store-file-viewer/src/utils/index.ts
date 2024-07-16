import { useMediaQuery } from "@mui/material";
import { Breakpoint, useTheme } from "@mui/material/styles";

export const useBreakpoint = (breakpoint: Breakpoint) => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down(breakpoint));
};

export const abbreviateNumber = (value: number, shortform = true): string => {
  return Intl.NumberFormat("en-US", {
    notation: shortform ? "compact" : undefined,
    maximumFractionDigits: 2,
  }).format(value);
};

export function formatBytes(
  bytes: number,
  decimals: number = 3,
  shortform: boolean = true,
  size: string | undefined = undefined,
  useBytes: boolean = true
) {
  if (!bytes) return "0 Bytes";

  const k = useBytes ? 1000 : 1024;
  const byteSizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
  const bitSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB", "PiB"];
  const sizes = useBytes ? byteSizes : bitSizes;

  const dm = decimals < 0 ? 0 : decimals;

  let i = Math.floor(Math.log(bytes) / Math.log(k));
  if (size !== undefined) {
    const sizeIdx = sizes.findIndex((s) => s === size);
    if (sizeIdx >= 0) {
      i = sizeIdx;
    }
  }

  if (i >= sizes.length) {
    return `bytes`;
  } else {
    return `${abbreviateNumber(
      parseFloat((bytes / Math.pow(k, i)).toFixed(dm)),
      shortform
    )} ${sizes[i]}`;
  }
}

export const parseErrorFromPangea = (error: any): string => {
  const response = error.response ?? {};
  if (!response) {
    return `${error}`;
  }

  if (response?.data?.status || response?.data?.summary) {
    return `${response?.data?.status}: ${response?.data?.summary}`;
  }

  return `${error}`;
};

export function passwordGenerator(len: number) {
  var length = len ? len : 10;
  var string = "abcdefghijklmnopqrstuvwxyz"; //to upper
  var numeric = "0123456789";
  var punctuation = "!@#$%^&*()_+~`|}{[]:;?><,./-=";
  var password = "";
  var character = "";
  var crunch = true;
  while (password.length < length) {
    let entity1 = Math.ceil(string.length * Math.random() * Math.random());
    let entity2 = Math.ceil(numeric.length * Math.random() * Math.random());
    let entity3 = Math.ceil(punctuation.length * Math.random() * Math.random());
    let hold = string.charAt(entity1);
    hold = password.length % 2 == 0 ? hold.toUpperCase() : hold;
    character += hold;
    character += numeric.charAt(entity2);
    character += punctuation.charAt(entity3);
    password = character;
  }
  password = password
    .split("")
    .sort(function () {
      return 0.5 - Math.random();
    })
    .join("");
  return password.substr(0, len);
}
