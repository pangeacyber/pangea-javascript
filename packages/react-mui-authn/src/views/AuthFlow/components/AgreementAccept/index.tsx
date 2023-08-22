import { FC, UIEvent, useEffect, useState } from "react";
import { Stack, Typography, useTheme } from "@mui/material";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { $convertFromMarkdownString } from "@lexical/markdown";
import LexicalClickableLinkPlugin from "@lexical/react/LexicalClickableLinkPlugin";

import { FlowStep } from "@pangeacyber/react-auth";
import { Button, ViewComponentProps } from "@pangeacyber/react-mui-authn";
import { isJSON } from "@src/utils";

const AgreementAccept: FC<ViewComponentProps> = ({ data, next, reset }) => {
  const [disable, setDisable] = useState<boolean>(true);
  const theme = useTheme();
  const content = data.eula || "";

  const mdConfig = {
    theme: {},
    editable: false,
    onError(error: Error) {
      throw error;
    },
    namespace: "Pangea",
    editorState: isJSON(content)
      ? content
      : () => {
          $convertFromMarkdownString(content, TRANSFORMERS);
        },
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      AutoLinkNode,
      LinkNode,
    ],
  };

  const acceptAgreement = (accept: boolean) => {
    next(FlowStep.VERIFY_EULA, { accept });
  };

  useEffect(() => {
    const el = document.getElementById("agreement-container");
    if (el && el.scrollHeight - el.scrollTop === el.clientHeight) {
      setDisable(false);
    }
  }, []);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const bottom =
      e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
      e.currentTarget.clientHeight;
    if (bottom) {
      setDisable(false);
    }
  };

  return (
    <Stack gap={3} sx={{ borderWidth: "1px" }} ml={-1} mr={-1}>
      <Typography variant="h6">License Agreement</Typography>
      <Stack
        id="agreement-container"
        onScroll={handleScroll}
        sx={{
          maxHeight: "400px",
          padding: "0 4px",
          overflowY: "auto",
          textAlign: "initial",
          // @ts-ignore
          fontSize: window.BRANDING?.font_size || "0.825em",
          fontColor: theme.palette.text.primary,
          "& :focus-visible": {
            outline: "none",
          },
          "& a": {
            cursor: "pointer",
            // @ts-ignore
            color: window.BRANDING?.link_color || "inherit",
          },
        }}
      >
        <LexicalComposer initialConfig={mdConfig}>
          <PlainTextPlugin
            contentEditable={<ContentEditable />}
            placeholder={null}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <LexicalClickableLinkPlugin />
        </LexicalComposer>
      </Stack>
      <Stack
        direction="row"
        gap={2}
        alignItems="center"
        justifyContent="center"
      >
        <Button color="secondary" onClick={reset}>
          Decline
        </Button>
        <Button
          color="primary"
          disabled={disable}
          onClick={() => {
            acceptAgreement(true);
          }}
        >
          Accept
        </Button>
      </Stack>
    </Stack>
  );
};

export default AgreementAccept;
