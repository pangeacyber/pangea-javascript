# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
