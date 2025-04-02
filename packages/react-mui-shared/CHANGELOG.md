# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.7] - 2025-04-01

### Fixed

- Keep the autocomplete search menu open on re-click even if the search box is empty

## [1.0.6] - 2025-02-27

### Fixed

- If autocomplete menu was previously open, first click on filter menu would close both

## [1.0.4] - 2025-02-25

### Added

- Updated TimeRangeSelect to support children prop and quickTimeRanges prop to override the default quick time range options of (1 day, 7 days, and 30 days)
- Exporting RelativeDateRangeField component relevant and utility functions
- Added PangeaDataGridProps.Search.ConditionalAutocompleteProps to specify OptionComponent override
- Fixed ConditionalAutocompleteProps option rendering to leverage label and caption option props
- Update PangeaDataGridProps.Search.Filters.FiltersFormComponent default component to support "number" and "date" field types

## [1.0.3] - 2024-12-18

### Added

- Added callback support for onVisibilityModelChange and onOrderChange

## [1.0.2] - 2024-11-14

### Fixed

- Configured table width, json-react-view default rendering

## [1.0.1] - 2024-11-05

### Added

- Downgraded @mui/x-data-grid to 7.21.0. Version 7.22.0 has a bug throwing an exception when the list of data is cleared

## [1.0.0] - 2024-11-04

### Added

- Upgrade material-ui packages to version 6
- "@mui/icons-material": "^6.0.0",
- "@mui/material": "^6.0.0",
- "@mui/x-date-pickers": "^7.22.1",

## [0.0.67] - 2024-09-04

### Fixed

- update react peerDependencies to ^17.0.0 || ^18.0.0

## [0.0.66] - 2024-09-03

### Fixed

- update @mui/x-data-grid to 7.15.0

## [0.0.65] - 2024-07-10

### Fixed

- setPage on useLastPagination now updates last right away

## [0.0.64] - 2024-07-10

### Fixed

- Expand/collapse column adjusting to state of the row
- Column configuration having a max height and scroll
- Datetime quick filter appearing even if column is too small

## [0.0.63] - 2024-06-14

### Added

- stringWithCopy cell support to pangea data grid

## [0.0.62] - 2024-06-14

### Added

- Add month and year to the time range filter dropdown

## [0.0.61] - 2024-05-30

### Added

- Fix bug with delayed query updating using "enter" search

## [0.0.59] - 2024-05-15

### Added

- Support optional "success" and "error" highlights to the JSONViewer component. As well a "info" to highlights to render a Tooltip around the highlighted text

## [0.0.58] - 2024-04-22

### Added

- Support optional onSearch callback for PangeaDataGrid. Triggered upon explicit refresh/search. Clicking the "Search" button or typing "Enter"

## [0.0.57] - 2024-03-25

### Fixed

- Update search autocomplete error helper text rendering, render links clickable

## [0.0.56] - 2024-02-26

### Fixed

- Catch exceptions on date

## [0.0.55] - 2024-02-26

### Fixed

- Support maxDate on dateTime field

## [0.0.54] - 2024-02-26

### Fixed

- Support search button prop overrides

## [0.0.53] - 2024-02-22

### Fixed

- Update search props

## [0.0.51] - 2024-02-22

### Fixed

- react-json-view is now lazy-loaded.

## [0.0.50] - 2024-02-22

### Fixed

- Pagination button reflect the primary color when not selected

## [0.0.48] - 2024-02-15

### Fixed

- Color to lighten/darken based on theme mode

## [0.0.47] - 2024-02-02

### Fixed

- Support controlled previewId prop on PangeaDataGrid. previewId of null will remove preview

## [0.0.46] - 2024-01-31

### Fixed

- Updated default PangeaDataGrid pagination to none, must be explicitly specified through ServerPagination or DataGridProps

## [0.0.45] - 2024-01-24

### Fixed

- Modal displaying the Close icon will not close on backdrop click

## [0.0.43] - 2024-01-16

### Added

- Now export fields components:
  - SelectField
- PopoutCard component

### Fixed

- useInternalState not triggering callback function

## [0.0.39] - 2024-01-12

### Added

- Now export fields components:
  - AuthPasswordField, CheckboxField, DateTimeField, StringArrayField, JsonField, StringField, SwitchField
- Multiline field supports TextFieldProps overrides and placeholder

## [0.0.37] - 2024-01-10

### Added

- FieldsPreview
- FieldsPreviewProps
- FieldsPreviewSchema
- FieldsForm
- SaveButtonProps
- FieldsFormProps
- FieldsFormSchema
- validatePassword
- PasswordPolicy
- PasswordPolicyChecks
- FieldComponentProps
- FieldControl
- PangeaModal
- PangeaDeleteModal

## [0.0.36] - 2023-09-26

### Added

- usePangeaListRequest
- useLastPagination
- FieldsPreview

## [0.0.35] - 2023-09-14

### Changed

- DateTimeCell use color prop

## [0.0.34] - 2023-09-14

### Changed

- Update build to use replace, to ensure minified code is set to production

## [0.0.25] - 2023-08-04

### Changed

- Updated JsonViewer highlighting logic

## [0.0.23] - 2023-07-26

### Changed

- Upgraded mui x-date-pickers

## [0.0.14] - 2023-03-28

## [0.0.16] - 2023-04-04

### Fixed

- Fix condition options not updating with new options

## [0.0.14] - 2023-03-28

### Fixed

- maxResults displayed as limit

## [0.0.13] - 2023-03-27

### Fixed

- Fix direct import of react-json-view. Only require is window is not undefined

## [0.0.12] - 2023-03-21

### Fixed

- Fix tooltip max length on TextCell

## [0.0.10] - 2023-03-12

### Fixed

- JSONViewer showing duplicate highlights on the same line

## [0.0.9] - 2023-03-12

### Fixed

- PangeaDataGrid support for default order in column customization
- PangeaDataGrid exporting PDG types namespace
- PangeaDataGrid search EndFilterButton support (Used for time quick time filtering)

## [0.0.7] - 2023-03-12

### Fixed

- Updated PangeaDataGrid to export useGridSchemaColumns helper hook to construct columns from a dictionary of typed columns

## [0.0.6] - 2023-02-21

### Fixed

- Updated PangeaDataGrid to support previewId, as a way to control the previewed row outside of the component

## [0.0.5] - 2023-02-21

### Fixed

- Updated selection model on PangeaDataGrid to unselect after closing preview panel

## [0.0.4] - 2023-01-26

### Fixed

- Updated RelativeDateRangeField validation check on range

## [0.0.3] - 2023-01-26

### Changed

- Updated RelativeDateRangeField to work off of full names for relative ranges. Examples: 1M (1 Month) -> 1month, 1m (1 Minute) -> 1minute
