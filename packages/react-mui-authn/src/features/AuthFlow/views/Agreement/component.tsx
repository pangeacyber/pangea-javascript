import { FC } from "react";

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

import { isJSON } from "@src/utils";

interface Props {
  content: string;
}

const LexicalViewer: FC<Props> = ({ content }) => {
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

  return (
    <LexicalComposer initialConfig={mdConfig}>
      <PlainTextPlugin
        contentEditable={<ContentEditable />}
        placeholder={null}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <LexicalClickableLinkPlugin />
    </LexicalComposer>
  );
};

export default LexicalViewer;
