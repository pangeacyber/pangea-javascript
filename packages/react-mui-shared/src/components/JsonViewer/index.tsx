import { FC } from "react";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useReactJsonViewHighlight, Highlight } from "./utils";
import ReactJson from "react-json-view";

export interface JsonViewerProps {
  src: object;
  highlights?: Highlight[];
  depth?: number;
  colors?: {
    highlightBackground: string;
    highlightColor: string;
  };
  allowEmpty?: boolean;
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
          color: `${theme.palette.info.main}!important`,
        },
        ".variable-value.Pangea-Highlight": {
          div: {
            backgroundColor: colors.highlightBackground,
            padding: "0 2px",
            color: `${colors.highlightColor}!important`,
          },
        },
        ".string-value.Pangea-Highlight": {
          backgroundColor: colors.highlightBackground,
          color: `${colors.highlightColor}!important`,
        },
        span: {
          opacity: `1!important`,
        },
      }}
    >
      <ReactJson
        name={null}
        src={allowEmpty && !src ? {} : src}
        collapsed={!!depth ? depth : false}
        displayDataTypes={false}
        displayObjectSize={false}
        enableClipboard={false}
        style={{
          backgroundColor: "transparent",
          fontFamily: "'Source Code Pro', monospace",
          fontSize: "0.875rem",
        }}
      />
    </Box>
  );
};

export default JsonViewer;
