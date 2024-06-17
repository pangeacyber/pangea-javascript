# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

- StoreFileViewer multi-select functionality. Multi-select now closes single file focus, opening context menu restarts multi-selection, unless opening on an already selected item or holding shift

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
