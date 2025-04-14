import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import {
  Alert,
  Box,
  Stack,
  Typography,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

import AuditLogViewer, { AuditLogViewerProps } from "../AuditLogViewer";
import PangeaThemeProvider from "./theme/pangea/provider";
import { TEST_SERVER } from "./server/api";
import { getConfigProps } from "./utils";
import { PublicAuditQuery } from "../types/query";

/**
 * Demonstrates how to dynamically set `initialQuery` and `filters.range`
 * (including relative, between, before, and after) in the AuditLogViewer.
 *
 * - **initialQuery**: A string that initializes the viewer’s search text.
 * - **filters.range**: One of { relative, between, before, after }, selectable via UI inputs.
 * - **Local State & Apply**: Inputs control local state, and clicking "Apply" updates props passed to the AuditLogViewer.
 *
 * Required callback props for retrieving and paginating logs:
 * - `onSearch`: Receives an `Audit.SearchRequest`, returns a Promise of `Audit.SearchResponse`.
 * - `onPageChange`: Receives an `Audit.ResultRequest`, returns a Promise of `Audit.ResultResponse`.
 *
 * Optionally, environment variables can be used to connect to a real Audit Log service:
 * - STORYBOOK_PANGEA_TOKEN = "pts_..."
 * - STORYBOOK_SERVICE_DOMAIN = "aws.us.pangea.cloud"
 * - STORYBOOK_CONFIG_ID = "pci_..."
 * - STORYBOOK_CLIENT_TOKEN = "pcl_..."
 *
 * @hidden
 */
export default {
  title: "DefaultsAuditLogViewer",
  component: AuditLogViewer,
  argTypes: {},
} as ComponentMeta<typeof AuditLogViewer>;

const Template: ComponentStory<typeof AuditLogViewer> = (args) => {
  // Local state for the string-based initial query
  const [localQuery, setLocalQuery] = useState<string>("");

  // Local state for the filter range
  // We'll keep track of the type (relative | between | before | after)
  // and the relevant date/time fields
  const [rangeType, setRangeType] = useState<
    "relative" | "between" | "before" | "after"
  >("relative");
  const [sinceValue, setSinceValue] = useState<string>("");
  const [afterValue, setAfterValue] = useState<string>("");
  const [beforeValue, setBeforeValue] = useState<string>("");

  // The filters state that we'll pass to the AuditLogViewer
  const [filters, setFilters] = useState<PublicAuditQuery>({
    query: { type: "object", citations: "prompt-guard" },
  });

  const handleApply = () => {
    let range;
    switch (rangeType) {
      case "relative":
        range = {
          type: "relative",
          since: sinceValue,
        };
        break;
      case "between":
        range = {
          type: "between",
          after: afterValue,
          before: beforeValue,
        };
        break;
      case "after":
        range = {
          type: "after",
          after: afterValue,
        };
        break;
      case "before":
        range = {
          type: "before",
          before: beforeValue,
        };
        break;
      default:
        range = undefined;
    }

    // Update filters in local state
    setFilters({
      range,
      // If desired, other parts of PublicAuditQuery (e.g. query: {}) can be added here
    });
  };

  return (
    <PangeaThemeProvider>
      <Stack spacing={2} sx={{ padding: 2 }}>
        <Alert severity="info">
          <Typography variant="body2">
            This story shows how to configure <strong>initialQuery</strong> and{" "}
            <strong>filters.range</strong>
            (relative, between, before, after) for the AuditLogViewer.
          </Typography>
        </Alert>

        {/* Input: initialQuery string */}
        <Box>
          <TextField
            label="Initial Query"
            variant="outlined"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            fullWidth
            helperText="Set the default query string"
          />
        </Box>

        {/* Range Type Selector */}
        <FormControl fullWidth>
          <InputLabel id="range-type-label">Range Type</InputLabel>
          <Select
            labelId="range-type-label"
            label="Range Type"
            value={rangeType}
            onChange={(e) => setRangeType(e.target.value as typeof rangeType)}
          >
            <MenuItem value="relative">Relative (since)</MenuItem>
            <MenuItem value="between">Between (after &amp; before)</MenuItem>
            <MenuItem value="after">After</MenuItem>
            <MenuItem value="before">Before</MenuItem>
          </Select>
        </FormControl>

        {/* Conditionally render the relevant date inputs based on rangeType */}
        {rangeType === "relative" && (
          <TextField
            label="Since (Relative duration, e.g. 7day, 2hour)"
            variant="outlined"
            value={sinceValue}
            onChange={(e) => setSinceValue(e.target.value)}
            fullWidth
            margin="normal"
          />
        )}

        {rangeType === "between" && (
          <Stack direction="row" spacing={2}>
            <TextField
              label="After (Simplified ISO 8601 date)"
              variant="outlined"
              type="date"
              value={afterValue}
              onChange={(e) => setAfterValue(e.target.value)}
              fullWidth
            />
            <TextField
              label="Before (Simplified ISO 8601 date)"
              variant="outlined"
              type="date"
              value={beforeValue}
              onChange={(e) => setBeforeValue(e.target.value)}
              fullWidth
            />
          </Stack>
        )}

        {rangeType === "after" && (
          <TextField
            label="After (Simplified ISO 8601 date)"
            type="date"
            variant="outlined"
            value={afterValue}
            onChange={(e) => setAfterValue(e.target.value)}
            fullWidth
          />
        )}

        {rangeType === "before" && (
          <TextField
            label="Before (Simplified ISO 8601 date)"
            variant="outlined"
            type="date"
            value={beforeValue}
            onChange={(e) => setBeforeValue(e.target.value)}
            fullWidth
          />
        )}

        {/* Apply Button */}
        <Button variant="contained" color="primary" onClick={handleApply}>
          Apply
        </Button>

        {/* Rendering the AuditLogViewer */}
        <Box className="widget" sx={{ padding: 1 }}>
          <AuditLogViewer
            {...args}
            initialQuery={localQuery}
            filters={filters}
          />
        </Box>
      </Stack>
    </PangeaThemeProvider>
  );
};

export const DefaultsAuditLogViewer: {
  args: AuditLogViewerProps;
} = Template.bind({});
DefaultsAuditLogViewer.args = {
  searchOnChange: false, // Disable search on each keystroke
  fpeOptions: {
    highlightRedaction: true,
  },
  onSearch: TEST_SERVER.onSearch,
  onPageChange: TEST_SERVER.onPageChange,
  // This merges in environment-specific config (e.g., tokens, domain, etc.)
  ...getConfigProps(),
};
