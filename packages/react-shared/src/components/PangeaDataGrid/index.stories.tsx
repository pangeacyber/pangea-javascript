import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import PangeaDataGrid from "./index";

export default {
  title: "PangeaDataGrid",
  component: PangeaDataGrid,
  argTypes: {
    name: {
      type: "string",
    },
  },
} as ComponentMeta<typeof PangeaDataGrid>;

const Template: ComponentStory<typeof PangeaDataGrid> = (args) => (
  <PangeaDataGrid {...args} />
);

export const SimpleDataGrid = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
SimpleDataGrid.args = {
  name: "Sitcoms",
  columns: [
    {
      field: "title",
    },
  ],
  data: [
    {
      id: 1,
      title: "The Office",
    },
    {
      id: 2,
      title: "It's Always Sunny in Philadelphia",
    },
  ],
};
