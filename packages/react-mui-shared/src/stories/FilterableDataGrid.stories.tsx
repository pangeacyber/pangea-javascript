import React, { useState } from "react";
import keyBy from "lodash/keyBy";
import mapValues from "lodash/mapValues";

import { IconButton, Stack, Typography } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { StoryFn, Meta } from "@storybook/react";

import {
  LinedPangeaDataGrid,
  PangeaDataGridProps,
} from "../components/PangeaDataGrid";
import { Show, SHOWS } from "./data/television";
import { SingleSelectCell, TextCell } from "../components/PangeaDataGrid/cells";

export default {
  title: "LinedPangeaDataGrid",
  component: LinedPangeaDataGrid,
  argTypes: {
    name: {
      type: "string",
    },
  },
} as Meta<typeof LinedPangeaDataGrid>;

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

const Template: StoryFn<typeof LinedPangeaDataGrid> = (args) => {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({});

  const [previewId, setPreviewId] = useState(undefined);

  // @ts-ignore
  const [data, setData] = useState<Show[]>(args.data);

  return (
    <ThemeProvider theme={createTheme({})}>
      <LinedPangeaDataGrid
        {...args}
        data={data}
        ActionColumn={{
          render: () => "Hello",
          isPinned: true,
          GridColDef: {
            renderHeader: () => "Testing",
            minWidth: 125,
          },
        }}
        ColumnCustomization={{
          visibilityModel: mapValues(
            keyBy(args.columns ?? [], "field"),
            () => true
          ),
          position: "inline",
        }}
        Search={{
          query,
          error: {
            message: "testing",
          },
          placeholder: "Search here...",
          onChange: setQuery,
          Filters: {
            filters,
            onFilterChange: setFilters,
            options: {
              title: {
                label: "Title",
              },
              tags: {
                label: "Tags",
                type: "csv",
              },
            },
            showFilterChips: true,
          },
          conditionalOptions: [
            {
              match: () => true,
              options: [
                {
                  value: "cheese:",
                  label: "Cheesy",
                },
              ],
            },
          ],
        }}
        PreviewPanel={{
          component: PreviewPanel,
          width: "350px",
          position: "fullHeight",
        }}
        previewId={previewId}
      />
    </ThemeProvider>
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
      renderCell: (params) => <TextCell params={params} />,
    },
    {
      field: "description",
      description: "Field: testing. Hi there",
      minWidth: 2000,
      renderCell: (params) => <TextCell params={params} />,
    },
  ],
  data: SHOWS,
};

export const MatcherDataGrid: {
  args: PangeaDataGridProps<any>;
} = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

MatcherDataGrid.args = {
  columns: [
    {
      field: "match_type",
      minWidth: 300,
      sortable: false,
      type: "singleSelect",
      resizable: true,
      renderCell: (params) => <SingleSelectCell params={params} />,
    },
    {
      field: "match_value",
      resizable: true,
      description: "Field: testing. Hi there",
      renderCell: (params) => <TextCell params={params} />,
    },
    {
      field: "match_score",
      type: "number",
      description: "Field: testing. Hi there",
      renderCell: (params) => <TextCell params={params} />,
    },
  ],
  data: [
    {
      disabled: false,
      id: 0,
      match_score: 1,
      match_type: "regex",
      match_value: "w",
    },
  ],
};
