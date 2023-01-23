import React, { useEffect, useState } from "react";
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

const Template: ComponentStory<typeof PangeaDataGrid> = (args) => {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({});

  const [page, setPage] = useState(1);
  const [trackedPages, setTrackedPages] = useState({
    [page]: {
      last: 0,
    },
  });
  const lastKnownPage = Math.max(
    ...Object.keys(trackedPages).map((k) => Number(k))
  );

  // @ts-ignore
  const [data, setData] = useState<Show[]>(args.data);

  useEffect(() => {
    const last = (page - 1) * 10;
    setTrackedPages((state) => ({
      ...state,
      [page]: {
        last,
      },
    }));
    setData(SHOWS.slice(last, last + 10));
  }, [page]);

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
      ServerPagination={{
        page: page,
        onPageChange: (page) => setPage(page),
        pageSize: 10,
        paginationRowCount: Math.min(lastKnownPage * 10, SHOWS.length),
        rowCount: SHOWS.length,
      }}
    />
  );
};

export const PagingDataGrid: {
  args: PangeaDataGridProps<Show>;
} = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

PagingDataGrid.args = {
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
  data: SHOWS.slice(0, 10),
};
