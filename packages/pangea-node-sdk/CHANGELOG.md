# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.6.0] - 2023-03-27

###

- Algorithm support in Vault Service

### Changed

- Algorithm name in Vault Service

## [1.5.0] - 2023-03-20

### Added

- Vault service support
- LICENSE

### Changed

- Update services examples

## [1.4.0] - 2023-03-01

### Added

- IP service add /geolocate, /vpn, /domain and /proxy endpoints support

## [1.3.0] - 2023-02-28

### Added

- Tenant ID support in Audit Service

## [1.2.0] - 2023-02-03

### Added

- Optional parameters support in Redact service

## [1.1.3] - 2023-01-27

### Changed

- Intel Domain and URL add reputation endpoint that will replace lookup endpoint
- Intel File add hashReputation() method. Lookup is deprecated deprecated.
- Intel File add filepathReputation() method. lookupFilepath is deprecated.

## [1.1.2] - 2023-01-25

### Changed

- Intel IP add reputation endpoint that will replace lookup endpoint
- Add count field in redact service result
- Change User-Agent format

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

[unreleased]: https://github.com/pangeacyber/pangea-javascript/compare/v1.6.0...main
[1.6.0]: https://github.com/pangeacyber/pangea-javascript/compare/v1.6.0...v1.6.0
[1.5.0]: https://github.com/pangeacyber/pangea-javascript/compare/v1.4.0...v1.5.0
[1.4.0]: https://github.com/pangeacyber/pangea-javascript/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/pangeacyber/pangea-javascript/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/pangeacyber/pangea-javascript/compare/v1.1.3...v1.2.0
[1.1.3]: https://github.com/pangeacyber/pangea-javascript/compare/v1.1.2...v1.1.3
[1.1.2]: https://github.com/pangeacyber/pangea-javascript/compare/v1.1.1...v1.1.2
[1.1.1]: https://github.com/pangeacyber/pangea-javascript/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/pangeacyber/pangea-javascript/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/pangeacyber/pangea-javascript/releases/tag/v1.0.0
