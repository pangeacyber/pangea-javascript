import React, { useEffect } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Box, Typography } from "@mui/material";

import { Audit } from "..";
import { verifyConsistencyProof_ } from "../utils/verification";

const newRoot: Audit.Root = {
  url: "",
  published_at: "",
  size: "",
};
const prevRoot: Audit.Root = {};

const testConsistencyProof = async (): Promise<string> => {
  const res = await verifyConsistencyProof_({
    // @ts-ignore
    record: undefined,
    newRoot,
    prevRoot,
  }).catch((err) => {
    throw err;
  });

  return `Verification Result: ${res}`;
};

const Template: ComponentStory<any> = (args) => {
  const [console, setConsole] = React.useState<
    { message: string; type: 0 | 1 }[]
  >([]);

  const log = (stdout: string) =>
    setConsole((c) =>
      c.concat([
        {
          message: stdout,
          type: 0,
        },
      ])
    );

  const error = (stderr: string) =>
    setConsole((c) =>
      c.concat([
        {
          message: stderr,
          type: 1,
        },
      ])
    );

  useEffect(() => {
    testConsistencyProof()
      .then((stdout) => log(stdout))
      .catch((err) => error(`${err}`));
  }, []);

  return (
    <Box className="widget" sx={{ padding: 1 }}>
      {console.map((c, i) => {
        return (
          <Typography
            key={`console-msg-${i}`}
            color={c?.type === 1 ? "error" : "initial"}
          >
            {c.message}
          </Typography>
        );
      })}
    </Box>
  );
};

export const Verification: {
  args: any;
} = Template.bind({});
Verification.args = {};

export default {
  title: "Verification Utils",
  component: Box,
  argTypes: {},
} as ComponentMeta<any>;
