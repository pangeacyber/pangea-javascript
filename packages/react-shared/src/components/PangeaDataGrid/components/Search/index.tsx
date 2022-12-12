import { FC, useRef, useState } from "react";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";

import {
  ButtonGroup,
  Button,
  Stack,
  LinearProgress,
  Box,
  IconButton,
} from "@mui/material";
import ConditionalAutocomplete, {
  ConditionalOption,
} from "../../../ConditionalAutocomplete";
import PopoutCard from "../../../PopoutCard";

import { useInternalState } from "../../../../utils/hooks";
import FiltersForm, { FilterFormProps } from "./FiltersForm";
import FiltersBar from "./FiltersBar";

interface SearchProps<FiltersObj> {
  query?: string;
  onChange: (query: string) => void;
  conditionalOptions?: ConditionalOption[];
  loading?: boolean;
  Filters?: FilterFormProps<FiltersObj>;
}

const Search = <
  FiltersObj extends { [key: string]: string } = Record<string, string>
>({
  query,
  onChange,
  conditionalOptions = [],
  loading = false,
  Filters,
}: SearchProps<FiltersObj>): JSX.Element => {
  const [query_, setQuery_] = useInternalState(query, onChange);
  const searchRef = useRef<HTMLDivElement | null>(null);

  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  return (
    <Stack spacing={1}>
      <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
        <ButtonGroup sx={{ flexGrow: 1 }}>
          <ConditionalAutocomplete
            ref={searchRef}
            placeholder={"Search..."}
            value={query_}
            options={conditionalOptions}
            onChange={setQuery_}
            InputProps={
              !!Filters
                ? {
                    endAdornment: (
                      <>
                        <IconButton
                          onClick={(event) => {
                            setFilterMenuOpen(true);
                            event.stopPropagation();
                          }}
                          size="small"
                        >
                          <FilterAltOutlinedIcon
                            color="action"
                            fontSize="small"
                          />
                        </IconButton>
                      </>
                    ),
                    size: "small",
                    sx: {
                      flexGrow: 1,
                      "&.MuiInputBase-root.MuiOutlinedInput-root": {
                        paddingRight: "8px",
                      },
                    },
                  }
                : undefined
            }
          />
        </ButtonGroup>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => onChange(query_)}
          disabled={loading}
        >
          Search
        </Button>
      </Stack>
      {!!Filters && Filters.showFilterChips && (
        <FiltersBar<FiltersObj> {...Filters} />
      )}
      {!!Filters && (
        <PopoutCard
          anchorRef={searchRef}
          open={filterMenuOpen}
          setOpen={setFilterMenuOpen}
          flatTop
        >
          <div style={{ width: (searchRef.current?.clientWidth ?? 0) - 36 }}>
            <FiltersForm<FiltersObj>
              {...Filters}
              onFilterChange={(filters) => {
                Filters.onFilterChange(filters);
                setFilterMenuOpen(false);
              }}
            />
          </div>
        </PopoutCard>
      )}
      {loading ? (
        <LinearProgress
          color="info"
          sx={{
            marginTop: "4px!important",
            height: "2px",
            marginBottom: "4px!important",
          }}
        />
      ) : (
        <Box sx={{ marginTop: "8px!important", height: "2px" }} />
      )}
    </Stack>
  );
};

export default Search;
