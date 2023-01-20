# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Intel IP add reputation endpoint that will replace lookup endpoint

## [1.1.1] - 2023-01-05

### Fixed

- Exported IP and URL intel service clients

### Changed

- Updated doc strings for intel services
- Made the `options` parameter in intel services an optional parameter

## [1.1.0] - 2023-01-05

### Added

- This CHANGELOG
- Functions to get token and domain according to test environment (PROD/DEV/STG)

### Fixed

- Some outdated links to docs

### Changed

- Token env var name is the same for all services

### Removed

- Remove older headers
- References to config id

## [1.0.0] - 2022-11-29

### Added

- Audit client
- Embargo client
- File Intel client
- Domain Intel client
- Redact client

[unreleased]: https://github.com/pangeacyber/pangea-javascript/compare/v1.1.0...main
[1.1.0]: https://github.com/pangeacyber/pangea-javascript/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/pangeacyber/pangea-javascript/releases/tag/v1.0.0
