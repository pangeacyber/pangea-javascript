import React, { useState } from "react";
import keyBy from "lodash/keyBy";
import mapValues from "lodash/mapValues";

import { IconButton, Stack, Typography } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import PangeaDataGrid, {
  LinedPangeaDataGrid,
  PangeaDataGridProps,
} from "../components/PangeaDataGrid";
import { Show, SHOWS } from "./data/television";
import { TextCell } from "../components/PangeaDataGrid/cells";

export default {
  title: "PangeaDataGrid",
  component: LinedPangeaDataGrid,
  argTypes: {
    name: {
      type: "string",
    },
  },
} as ComponentMeta<typeof LinedPangeaDataGrid>;

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

const Template: ComponentStory<typeof LinedPangeaDataGrid> = (args) => {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({});

  const [previewId, setPreviewId] = useState("2");

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
      renderCell: (params) => <TextCell params={params} />,
    },
  ],
  data: SHOWS,
};
