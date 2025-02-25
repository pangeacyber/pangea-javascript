import { FC, ReactNode, useRef, useState } from "react";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";

import {
  ButtonGroup,
  Button,
  Stack,
  LinearProgress,
  Box,
  IconButton,
  SxProps,
  ButtonProps,
} from "@mui/material";
import ConditionalAutocomplete, {
  ConditionalOption,
} from "../../../ConditionalAutocomplete";
import PopoutCard from "../../../PopoutCard";

import { useInternalState } from "../../../../utils/hooks";
import FiltersForm, { FilterFormProps } from "./FiltersForm";
import FiltersBar from "./FiltersBar";
import ColumnsPopout, { ColumnsPopoutProps } from "./ColumnsPopout";
import { PDG } from "../../types";
import { OptionComponentProps } from "../../../ConditionalAutocomplete/AutocompleteOptionComponent";

export interface SearchProps<FiltersObj> {
  query?: string;
  error?: PDG.SearchError;
  onSearch?: () => void;
  onChange: (query: string) => void;
  placeholder?: string;
  conditionalOptions?: ConditionalOption[];
  loading?: boolean;
  Filters?: FilterFormProps<FiltersObj>;
  ColumnsPopoutProps?: ColumnsPopoutProps;
  EndFilterButton?: FC<FilterFormProps<FiltersObj>>;
  EndBarComponent?: ReactNode;
  StartBarComponent?: ReactNode;
  SearchButtonSx?: SxProps;
  SearchButtonProps?: Partial<ButtonProps>;
  ConditionalAutocompleteProps?: {
    OptionComponent?: FC<OptionComponentProps>;
  };
}

const Search = <
  FiltersObj extends { [key: string]: string } = Record<string, string>,
>({
  query,
  error,
  placeholder,
  onSearch,
  onChange,
  conditionalOptions = [],
  loading = false,
  Filters,
  ColumnsPopoutProps,
  EndFilterButton,
  EndBarComponent,
  StartBarComponent,
  SearchButtonSx,
  SearchButtonProps,
}: SearchProps<FiltersObj>): JSX.Element => {
  const [query_, setQuery_] = useInternalState(query, onChange);
  const searchRef = useRef<HTMLDivElement | null>(null);

  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  const handleSearch = () => {
    if (onSearch) {
      if (query_ !== query) {
        onChange(query_);
        setTimeout(() => {
          onSearch();
        }, 200);
      } else {
        return onSearch();
      }
    } else {
      onChange(query_);
    }
  };

  return (
    <Stack spacing={1}>
      <Stack
        className="PangeaDataGrid-SearchBar-root"
        direction="row"
        spacing={1}
        sx={{ width: "100%" }}
      >
        {!!StartBarComponent && StartBarComponent}
        <ButtonGroup sx={{ flexGrow: 1 }}>
          <ConditionalAutocomplete
            ref={searchRef}
            placeholder={placeholder ?? "Search..."}
            value={query_}
            options={conditionalOptions}
            onChange={setQuery_}
            hideMenu={filterMenuOpen}
            onOpen={() => {
              setFilterMenuOpen(false);
            }}
            error={error?.message}
            size="small"
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
                    onKeyUp: (e) => {
                      if (e.key === "Enter") handleSearch();
                    },
                    size: "small",
                    sx: {
                      flexGrow: 1,
                      "&.MuiInputBase-root.MuiOutlinedInput-root": {
                        paddingRight: "8px",
                      },
                      ...(!!EndFilterButton
                        ? {
                            borderBottomRightRadius: "0!important",
                            borderTopRightRadius: "0!important",
                          }
                        : {}),
                    },
                  }
                : undefined
            }
          />
          {!!EndFilterButton && !!Filters && <EndFilterButton {...Filters} />}
        </ButtonGroup>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleSearch}
          disabled={loading}
          sx={{ maxHeight: "42px", ...SearchButtonSx }}
          {...SearchButtonProps}
        >
          Search
        </Button>
        {!!EndBarComponent && EndBarComponent}
        {!!ColumnsPopoutProps && <ColumnsPopout {...ColumnsPopoutProps} />}
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
            {!!Filters?.FiltersFormComponent ? (
              <Filters.FiltersFormComponent
                filters={Filters.filters}
                options={Filters.options}
                onFilterChange={(filters) => {
                  Filters.onFilterChange(filters);
                  setFilterMenuOpen(false);
                }}
              />
            ) : (
              <FiltersForm<FiltersObj>
                {...Filters}
                onFilterChange={(filters) => {
                  Filters.onFilterChange(filters);
                  setFilterMenuOpen(false);
                }}
              />
            )}
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
