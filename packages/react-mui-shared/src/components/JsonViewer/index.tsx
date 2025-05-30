import { FC, Suspense, lazy } from "react";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useReactJsonViewHighlight, Highlight } from "./utils";

const ReactJson = lazy(() => import("react-json-view"));

export interface JsonViewerProps {
  src: object;
  highlights?: Highlight[];
  depth?: number;
  colors?: {
    highlightBackground: string;
    successBackground?: string;
    errorBackground?: string;
    highlightColor: string;
  };
  allowEmpty?: boolean;

  ReactJsonViewProps?: Partial<{
    enableClipboard?: boolean | ((copy: any) => void); // default false
    sortKeys?: boolean; // default false
    quotesOnKeys?: boolean; // default true
    displayDataTypes?: boolean; // defaults false
    displayArrayKey?: boolean; // defaults false
    displayObjectSize?: boolean; // defaults false
    groupArraysAfterLength?: number; // defaults 100
    collapsed?: boolean | number; // defaults false
    indentWidth?: number;
  }>;
}

const JsonViewer: FC<JsonViewerProps> = ({
  src,
  highlights = [],
  depth,
  colors = {
    highlightBackground: "#FFFF0B",
    highlightColor: "#000",
  },
  allowEmpty = false,
  ReactJsonViewProps,
}) => {
  const theme = useTheme();
  const ref = useReactJsonViewHighlight(highlights);

  if (typeof window === "undefined") {
    return null;
  }

  return (
    <Box
      ref={ref}
      sx={{
        background: "transparent",
        borderRadius: "4px",
        padding: "8px",
        paddingTop: "0px",
        marginTop: "-4px",
        paddingLeft: "4px",
        ".object-key-val, .variable-row": {
          borderLeft: "none!important",
        },
        ".expanded-icon > svg, .collapsed-icon > svg": {
          verticalAlign: "middle!important",
          marginTop: "-2px",
          color: `${(theme.vars || theme).palette.info.main}!important`,
        },
        ".variable-value.PangeaHighlight-highlight": {
          div: {
            backgroundColor: colors.highlightBackground,
            padding: "0 2px",
            color: `${colors.highlightColor}!important`,
          },
        },
        ".string-value.PangeaHighlight-highlight": {
          backgroundColor: colors.highlightBackground,
          color: `${colors.highlightColor}!important`,
        },
        ".variable-value.PangeaHighlight-success": {
          div: {
            padding: "0 2px",
            color: (theme) =>
              `${colors.successBackground ?? (theme.vars || theme).palette.success.main}!important`,
          },
        },
        ".string-value.PangeaHighlight-success": {
          color: (theme) =>
            `${colors.successBackground ?? (theme.vars || theme).palette.success.main}!important`,
        },
        ".variable-value.PangeaHighlight-error": {
          div: {
            backgroundColor: (theme) =>
              colors.errorBackground ??
              (theme.vars || theme).palette.error.main,
            padding: "0 2px",
            color: (theme) =>
              `${colors.errorBackground ?? (theme.vars || theme).palette.error.main}!important`,
          },
        },
        ".string-value.PangeaHighlight-error": {
          color: (theme) =>
            `${colors.errorBackground ?? (theme.vars || theme).palette.error.main}!important`,
        },
        span: {
          opacity: `1!important`,
        },
      }}
    >
      <Suspense fallback="Loading...">
        <ReactJson
          name={null}
          src={allowEmpty && !src ? {} : src}
          collapsed={!!depth ? depth : false}
          displayDataTypes={false}
          displayObjectSize={false}
          enableClipboard={false}
          displayArrayKey={false}
          style={{
            backgroundColor: "transparent",
            fontFamily: "'Source Code Pro', monospace",
            fontSize: "0.875rem",
          }}
          {...ReactJsonViewProps}
        />
      </Suspense>
    </Box>
  );
};

export default JsonViewer;
