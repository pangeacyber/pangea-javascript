import React, { useState, useCallback } from "react";
import keyBy from "lodash/keyBy";
import mapValues from "lodash/mapValues";

import { IconButton, Stack, Typography, Button } from "@mui/material";
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

  const [previewId, setPreviewId] = useState<number | undefined>(undefined);

  // @ts-ignore
  const [data, setData] = useState<Show[]>(args.data);

  const selected = keyBy(data, "id");

  const renderOptions = useCallback(
    (show: Show) => {
      return (
        <Stack>
          <Button
            onClick={() => {
              setData((state) => state.filter((s) => s.id != show.id));
            }}
          >
            Remove
          </Button>
        </Stack>
      );
    },
    [setData]
  );

  return (
    <ThemeProvider theme={createTheme({})}>
      <Stack spacing={1}>
        <Button
          onClick={() => {
            const newShow = SHOWS.filter((s) => !selected[s.id])[0];
            if (newShow) {
              setData((state) => state.concat([newShow]));
              setPreviewId(newShow?.id);
            }
          }}
        >
          Add
        </Button>
        <LinedPangeaDataGrid
          {...args}
          data={data}
          ActionColumn={{
            render: renderOptions,
            isPinned: true,
            GridColDef: {
              renderHeader: () => "",
              minWidth: 150,
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
          previewId={!!selected[previewId ?? 0] ? `${previewId}` : undefined}
        />
      </Stack>
    </ThemeProvider>
  );
};

export const EditableDataGrid: {
  args: PangeaDataGridProps<Show>;
} = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

EditableDataGrid.args = {
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
  data: [],
};
