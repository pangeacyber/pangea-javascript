import React, { FC } from "react";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useReactJsonViewHighlight, Highlight } from "./utils";

import ReactJson from "react-json-view";


interface Props {
  src: object;
  highlights?: Highlight[];
  depth?: number;
  colors?: {
    highlightBackground: string;
    highlightColor: string;
  };
}

const JsonViewer: FC<Props> = ({
  src,
  highlights = [],
  depth,
  colors = {
    highlightBackground: "#FFFF0B",
    highlightColor: "#000",
  },
}) => {
  const theme = useTheme();
  const ref = useReactJsonViewHighlight(highlights);

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
        ".variable-value.highlighted": {
          div: {
            backgroundColor: colors.highlightBackground,
            padding: "0 2px",
            color: `${colors.highlightColor}!important`,
          },
        },
        ".string-value.highlighted": {
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
        src={src}
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
