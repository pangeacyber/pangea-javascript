import React, { useEffect, useState } from "react";
import keyBy from "lodash/keyBy";
import mapValues from "lodash/mapValues";

import { StoryFn, Meta } from "@storybook/react";

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
} as Meta<typeof PangeaDataGrid>;

const Template: StoryFn<typeof PangeaDataGrid> = (args) => {
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
        onSearch: () => {
          console.log("Refresh search");
        },
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
        maxResults: 1000,
        maxResultOptions: [1000, 2000],
        onMaxResultChange: (maxResults) => {},
        rowsPerPageOptions: [10, 20],
        onPageSizeChange: () => {},
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
      field: "description1",
      flex: 10,
    },
    {
      field: "description2",
      flex: 10,
    },
    {
      field: "description3",
      flex: 10,
    },
    {
      field: "description4",
      flex: 10,
    },
    {
      field: "description5",
      flex: 10,
    },
    {
      field: "description6",
      flex: 10,
    },
    {
      field: "description7",
      flex: 10,
    },
    {
      field: "description8",
      flex: 10,
    },
    {
      field: "description9",
      flex: 10,
    },
    {
      field: "description10",
      flex: 10,
    },
    {
      field: "description11",
      flex: 10,
    },
    {
      field: "description12",
      flex: 10,
    },
    {
      field: "description13",
      flex: 10,
    },
    {
      field: "description14",
      flex: 10,
    },
  ],
  data: SHOWS.slice(0, 10),
};
