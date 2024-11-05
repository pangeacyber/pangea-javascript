# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-11-04

### Added

- Upgrade material-ui packages to version 6
- "@mui/icons-material": "^6.0.0",
- "@mui/material": "^6.0.0",
- "@pangeacyber/react-mui-shared": "1.0.0-beta.0",

## [0.0.3] - 2024-10-29

### Fixed

- ESM import not existing at the path it was supposed to be located at.

## [0.0.2] - 2024-10-11

### Changed

- Publish @pangeacyber/react-mui-share-file-viewer as a public package

## [0.0.1] - 2024-10-03

### Changed

- Renamed package from @pangeacyber/react-mui-store-file-viewer to @pangeacyber/react-mui-share-file-viewer

## [0.0.69] - 2024-09-25

### Fixed

- Don't show password copy modal after Get Link modal

### Changed

- Updated "Share via Email" and "Get Link" button style to outlined

## [0.0.68] - 2024-09-19

### Fixed

- Removed object link truthy check over share link options

## [0.0.67] - 2024-09-19

### Added

- Use share link get to retrieve links for copy

## [0.0.66] - 2024-09-16

### Fixed

- "Get Link" password method helper text corrected

### Added

- Show modal with copy password dialog after "Share via Email" password link creation

## [0.0.65] - 2024-09-04

### Added

- Updated to the latest @pangeacyber/react-mui-share@0.0.67

## [0.0.64] - 2024-09-04

### Added

- Updated to the latest @pangeacyber/react-mui-share@0.0.66, which updates @mui/x-data-grid@^7.15.0 supporting resizeable columns

## [0.0.63] - 2024-08-30

### Fixed

- Add delay to updating filters when also updating page, to ensure filters are applied after `last` is updated

## [0.0.61] - 2024-08-28

### Added

- Added virtualRoot prop to support single shared folders

## [0.0.60] - 2024-08-23

### Added

- New `sender` props in provider configurations

## [0.0.59] - 2024-08-22

### Added

- Track recipient email on Share via Email
- Update share details ux

## [0.0.58] - 2024-08-13

### Fixed

- Share via Email password validation

## [0.0.57] - 2024-08-13

### Added

- Update create share ux flow
- Add share link ux flow

## [0.0.56] - 2024-07-29

- Show create button on download viewer when apiRef.folderCreate is set

## [0.0.55] - 2024-07-25

### Fixed

- Switched byte calculations to always uses 1024

## [0.0.53] - 2024-07-23

### Fixed

- Switching buckets clears currently filters and re-searches on root

## [0.0.52] - 2024-07-16

### Fixed

- Download in row shouldn't open details

## [0.0.51] - 2024-07-16

### Fixed

- Update bucket selector rendering to display default

## [0.0.50] - 2024-07-16

### Added

- Column customizations to override grid column fields, such as width

### Fixed

- Switch from displaying bits to bytes
- Move download button from the details panel
- Reduced file name typography variant

## [0.0.49] - 2024-07-10

### Fixed

- Upgraded @pangeacyber/react-mui-share@0.0.64

## [0.0.48] - 2024-07-09

### Fixed

- Share link create button to use forwardRef

## [0.0.47] - 2024-07-09

### Add

- Added support for react:18

## [0.0.46] - 2024-07-09

### Add

- Support for buckets apiRef callback. If provided will update the viewer to attempt to fetch available buckets from secure object store. Allowing the user to switch between what bucket they are viewing

## [0.0.45] - 2024-06-14

### Add

- Add optional parameter to include id as a column

## [0.0.44] - 2024-03-25

### Fixed

- Update to @pangeacyber/react-mui-shared@0.0.57

## [0.0.43] - 2024-03-22

### Fixed

- Display error on send modal, require email to send

## [0.0.42] - 2024-03-20

### Fixed

- Fix bytes rendering to display "KiB", "MiB", "GiB", "TiB", "PiB"

## [0.0.41] - 2024-03-20

### Fixed

- Fix bug rendering email valiation error in sharing sms share link modal

## [0.0.40] - 2024-03-14

### Fixed

- On folder navigation reset to page 1

## [0.0.39] - 2024-03-14

### Fixed

- Add padding to search header with preview panel

## [0.0.38] - 2024-03-12

### Fixed

- Fixed error messaging in settings

## [0.0.37] - 2024-03-12

### Fixed

- Fixed bug with opening options menu closing file preview
- Fixed min access count
- Added support for max date and max access count

## [0.0.36] - 2024-03-11

### Fixed

- Fixed bug with re-opening same file does not show preview

## [0.0.33] - 2024-02-26

### Fixed

- Update to @pangeacyber/react-mui-share@0.0.54

## [0.0.32] - 2024-02-22

### Fixed

- Update to @pangeacyber/react-mui-share@0.0.52

## [0.0.31] - 2024-02-15

### Fixed

- Color to lighten/darken based on theme mode

## [0.0.30] - 2024-02-14

### Added

- File password protection

## [0.0.29] - 2024-02-12

### Added

- File scan result to file details view

## [0.0.27] - 2024-02-01

### Fixed

- ShareFileViewer multi-select functionality. Multi-select now closes single file focus, opening context menu restarts multi-selection, unless opening on an already selected item or holding shift

## [0.0.26] - 2024-02-01

### Fixed

- Updated configurations for maxViewCount to defaultViewCount and add defaultExpiresAt

## [0.0.25] - 2024-01-29

### Added

- Update cancel labels for folder creation and send shares modal
- Support settings in configurations for maxViewCount

## [0.0.24] - 2024-01-25

### Added

- Added built-in Alert popups configuration options on API error

## [0.0.22] - 2024-01-24

### Fixed

- Updated to @pangeacyber/react-mui-share@0.0.45. Share creation modals do not close on click away

## [0.0.20] - 2024-01-23

### Fixed

- Updated share link confirmation button label to reflect selected authentication method

## [0.0.19] - 2024-01-19

### Fixed

- Share link icons in file listing reflecting link type, support quick copy password post creation

## [0.0.18] - 2024-01-19

### Fixed

- Download target to "zip" for DownloadFileViewer

## [0.0.17] - 2024-01-16

### Fixed

- Added loading indicator to download search control
- Removed uppercase on folder path

## [0.0.14] - 2024-01-16

### Added

- Supporting passing title and message to share creation

### Fixed

- Updates share links creation modals

## [0.0.10] - 2024-01-11

### Fixed

- Multi-select bulk deletion was not fully clearing deleted files. Added a delay to reload data, in case search results still contained recently delete files.

## [0.0.9] - 2024-01-10

### Fixed

- Fixed bug on download file viewer rename form

## [0.0.8] - 2024-01-10

### Added

- Updated StoreDownloadFileViewer to support upload, rename and delete operations with the right callbacks provided
- Added Delete as a support action from the file context menu

## [0.0.7] - 2024-01-09

### Added

- File name conflict confirmation modal

## [0.0.6] - 2024-01-08

### Added

- Upload popover support

## [0.0.1] - 2023-09-25

### Added
