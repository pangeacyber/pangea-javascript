import { FC, useRef } from "react";

import { ButtonGroup, Button, Stack, LinearProgress, Box } from "@mui/material";
import ConditionalAutocomplete, {
  ConditionalOption,
} from "../../../ConditionalAutocomplete";

import { useInternalState } from "../../../../utils/hooks";

interface SearchProps {
  query?: string;
  onChange: (query: string) => void;
  conditionalOptions?: ConditionalOption[];
  loading?: boolean;
}

const Search: FC<SearchProps> = ({
  query,
  onChange,
  conditionalOptions = [],
  loading = false,
}) => {
  const [query_, setQuery_] = useInternalState(query, onChange);
  const searchRef = useRef<HTMLDivElement | null>(null);

  return (
    <>
      <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
        <ButtonGroup sx={{ flexGrow: 1 }}>
          <ConditionalAutocomplete
            ref={searchRef}
            placeholder={"Search..."}
            value={query_}
            options={conditionalOptions}
            onChange={setQuery_}
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
      {loading ? (
        <LinearProgress
          color="info"
          sx={{ marginTop: 0.5, height: "2px", marginBottom: 0.5 }}
        />
      ) : (
        <Box sx={{ marginTop: 1, height: "2px" }} />
      )}
    </>
  );
};

export default Search;
