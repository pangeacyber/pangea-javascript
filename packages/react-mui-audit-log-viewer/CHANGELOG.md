# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.80] - 2024-06-09

### Changed

- ts-jest is now a dev dependency instead of a regular dependency.

## [0.0.79] - 2024-05-31

### Fixed

- Treat "text" field type as long string field. Available in search auto-complete and flex grow column

## [0.0.78] - 2024-05-30

### Fixed

- Typing "Enter" to trigger search now reflects current query in search input on search, instead of out of sync query

## [0.0.77] - 2024-05-17

### Added

- Added searchOnFilterChange boolean prop, to allow the user to control if the AuditLogViewer should trigger a search on filters change. Default: true

## [0.0.75] - 2024-05-15

### Added

- Added fpeOptions prop, to control whether format preserving encryption should be highlighted

## [0.0.74] - 2024-05-02

### Fixed

- Fixed removing error on successful followup download

## [0.0.73] - 2024-04-22

### Added

- Added searchOnChange boolean prop, to allow the user to change the default behaviour of auto searching on query change

## [0.0.72] - 2024-04-16

### Added

- Added schemaOptions prop, which accepts hiddenFields to remove fields from the schema

## [0.0.71] - 2024-03-25

### Changed

- Update to @pangeacyber/react-mui-shared@0.0.57

## [0.0.70] - 2024-02-28

### Changed

- Update to work with latest download endpoint

## [0.0.69] - 2024-02-26

### Changed

- Update to @pangeacyber/react-mui-share@0.0.54

## [0.0.67] - 2024-02-23

### Changed

- Switch download to json

## [0.0.65] - 2024-02-22

### Changed

- Only support download if there is more than one result

## [0.0.64] - 2024-02-22

### Changed

- Update to include optional onDownload callback

## [0.0.63] - 2024-02-22

### Changed

- Update to @pangeacyber/react-mui-shared@0.0.50

## [0.0.62] - 2024-02-15

### Fixed

- Color to lighten/darken based on theme mode

## [0.0.60] - 2024-01-24

### Fixed

- Update audit log viewer to display error if onSearch response is missing required fields

## [0.0.58] - 2024-01-22

### Fixed

- Support sorting columns by all fields, except unindexed string fields

## [0.0.57] - 2024-01-10

### Changed

- Updated @pangeacyber/react-mui-shared to version 0.0.37.

## [0.0.56] - 2024-01-04

### Changed

- Updated time range select border color to use theme secondary, matching outlined input
- Updated @pangeacyber/react-mui-shared to version 0.0.36-beta.24. Which updates pagination coloring of buttons to use transparent background when not the active page

## [0.0.49] - 2023-11-6

### Changed

- Stopped using axios and replaced it with browser native `fetch` API.

## [0.0.48] - 2023-11-1

### Changed

- Updated vulnerable packages: axios, crypto-js

## [0.0.47] - 2023-09-14

### Changed

- Update build to use replace, to ensure minified code is set to production

## [0.0.44] - 2023-09-13

### Changed

- Updated to LinedPangeaDataGrid styling

## [0.0.42] - 2023-08-16

### Changed

- Updated support for rendering bad format exceptions as input errors.
- Add quick filter support for datetime fields

## [0.0.38] - 2023-07-26

### Changed

- Updated @pangeacyber/react-mui-shared to 0.0.23, which updated date-pickers and data-grid

## [0.0.34] - 2023-05-02

### Fixed

- Add valid_signature check within VerificationModal

## [0.0.33] - 2023-04-04

### Fixed

- Updated to display field id in table

## [0.0.32] - 2023-03-28

### Fixed

- Updated to show max results

## [0.0.30] - 2023-03-27

### Fixed

- Update @pangeacyber/react-mui-shared version to 0.0.13

## [0.0.29] - 2023-03-22

### Fixed

- Fix columns not updating properly

## [0.0.28] - 2023-03-22

### Fixed

- Add errors support to audit log viewer

## [0.0.27] - 2023-03-21

### Fixed

- Update to support config parameter to fetch custom audit log schema

## [0.0.26] - 2023-03-20

### Fixed

- Update audit schema to snakecase ui_default_visible

## [0.0.25] - 2023-03-20

### Fixed

- Update verification cmd public key escaping

## [0.0.24] - 2023-03-13

### Fixed

- Support generic schema in audit-log-viewer

## [0.0.23] - 2023-03-13

### Fixed

- Fixed clicking search not triggering search call

## [0.0.22] - 2023-03-13

### Fixed

- Support verification copy handler and verification model children components

## [0.0.21] - 2023-03-13

### Fixed

- Fixed unpublished record verification

## [0.0.20] - 2023-03-12

### Added

- initialQuery support to AuditLogViewer

### Fixed

- Switched off of custom Search components, using shared PangeaDataGrid components

## [0.0.11] - 2023-03-10

### Fixed

- Bugfix use crypto-js for membership verification

## [0.0.9] - 2023-03-10

### Fixed

- Fix AuditLogViewer verification column if verificationOptions are passed

## [0.0.8] - 2023-02-25

### Fixed

- `tenant_id` in the expanded audit log table row now shows `-` if the tenant_id is an empty string

## [0.0.7] - 2023-02-22

### Added

- New column in the Audit Log Table: `tenant_id`
- Added `tenant_id` and `timestamp` to the expanded audit log table row

## [0.0.6] - 2023-02-21

### Fixed

- Updated AuditLogViewer to support timestamp field

## [0.0.5] - 2023-01-26

### Fixed

- Time range filtering unable to change between relative ranges. Updated @pangeacyber/react-mui-shared to 0.0.4

## [0.0.4] - 2023-01-26

### Changed

- Updated AuditLogViewer to support filters prop
