import React, { FC } from "react";
import { StoryFn, Meta } from "@storybook/react";

import JsonViewer, { JsonViewerProps } from "../components/JsonViewer";

export default {
  title: "JsonViewer",
  component: JsonViewer,
  argTypes: {
    name: {
      type: "string",
    },
  },
} as Meta<typeof JsonViewer>;

const Template: StoryFn<FC<Partial<JsonViewerProps>>> = (args) => {
  return (
    <JsonViewer
      src={args.src ?? {}}
      highlights={args.highlights}
      depth={args.depth}
    />
  );
};

export const JsonViewerDemo: {
  args: Partial<JsonViewerProps>;
} = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

JsonViewerDemo.args = {
  src: {
    email: "sourabh@s.com",
  },
  highlights: [
    {
      value: "s",
      color: "highlight",
      prefix: '{ "email": "sourabh@',
      suffix: ".",
    },
    { value: "com", color: "highlight", prefix: ".", suffix: '" }' },
  ],
  depth: 3,
};
