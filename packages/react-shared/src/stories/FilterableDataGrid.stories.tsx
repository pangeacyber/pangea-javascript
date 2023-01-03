import React, { useState } from "react";
import keyBy from "lodash/keyBy";
import mapValues from "lodash/mapValues";

import { IconButton, Stack, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import PangeaDataGrid, {
  PangeaDataGridProps,
} from "../components/PangeaDataGrid";
import { Show, SHOWS } from "./data/television";

export default {
  title: "PangeaDataGrid",
  component: PangeaDataGrid,
  argTypes: {
    name: {
      type: "string",
    },
  },
} as ComponentMeta<typeof PangeaDataGrid>;

const PreviewPanel = ({ data, onClose }) => {
  return (
    <Stack width="350px" padding={1} spacing={1}>
      <Stack direction="row">
        <Typography variant="h5">{data.title}</Typography>
        <IconButton onClick={onClose} sx={{ marginLeft: "auto!important" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Stack>
      <Stack>
        <Stack direction="row" spacing={1}>
          <Typography variant="subtitle1" width="130px">
            Description
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {data.description}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

const Template: ComponentStory<typeof PangeaDataGrid> = (args) => {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({});

  // @ts-ignore
  const [data, setData] = useState<Show[]>(args.data);

  return (
    <PangeaDataGrid
      {...args}
      data={data}
      ColumnCustomization={{
        visibilityModel: mapValues(
          keyBy(args.columns ?? [], "field"),
          () => true
        ),
      }}
      Search={{
        query,
        placeholder: "Search here...",
        onChange: setQuery,
        Filters: {
          filters,
          onFilterChange: setFilters,
          options: {
            title: {
              label: "Title",
            },
          },
          showFilterChips: true,
        },
      }}
      PreviewPanel={PreviewPanel}
    />
  );
};

export const FilterableDataGrid: {
  args: PangeaDataGridProps<Show>;
} = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

FilterableDataGrid.args = {
  columns: [
    {
      field: "title",
      width: 200,
    },
    {
      field: "description",
      flex: 10,
    },
  ],
  data: SHOWS,
};
