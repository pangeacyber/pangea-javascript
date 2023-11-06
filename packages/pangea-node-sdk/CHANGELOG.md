# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0] - 2023-10-23

# Added

- AuthN v2 support

# Removed

- AuthN v1 support

## [2.3.0] - 2023-09-26

# Added

- FileScan Reversinglabs provider example
- Domain WhoIs endpoint support

# Changed

- Deprecated config_id in PangeaConfig. Now is set in service initialization.

# Fixed

- HashType supported in File Intel

## [2.2.1] - 2023-09-14

# Added

- Authn dropped use_new parameter for user listing

## [2.2.0] - 2023-09-05

# Added

- Redact rulesets field support
- FileScan service support

## [2.1.0] - 2023-07-14

# Added

- Vault /folder/create endpoint support

## [2.0.0] - 2023-07-06

# Changed

- Event interface is now a key:object map
- Rename some result interfaces with "result" postfix
- Create new Intel request/result interfaces per service

# Removed

- Intel services all deprecated methods
- Audit.Log options: Remove signMode due to vault signing is done by token

## [1.10.0] - 2023-06-26

# Added

- Multiconfig support
- Instructions to setup token and domain in examples

## [1.9.1] - 2023-06-08

# Added

- Defang examples
- Intel IP /domain, /vpn and /proxy endpoint examples

# Changed

- Intel User password breached full workflow example
- Update got package to fix vulnerability

# Fixed

- Redact service was ignoring return_result param

## [1.9.0] - 2023-05-25

# Added

- New algorithm support in Vault Service
- Algorithm field support in Audit Service
- Cymru IP Intel provider examples
- Support full url as domain in config for local use
- Http support on domain

### Fixed

- AuthN: `authn.user.invites.list()` was missing an optional parameters object [@r3dcrosse](https://github.com/r3dcrosse)
- typo in queuedRetries on ConfigOptions

### Changed

- AuthN: `authn.user.login.social()` had wrong provider TypeScript type: `AuthN.MFAProvider`, but should be `AuthN.IDProvider` [@r3dcrosse](https://github.com/r3dcrosse)

## [1.8.0] - 2023-04-21

### Added

- AuthN Service support

## [1.7.0] - 2023-04-10

### Added

- Audit-Vault signing integration support
- Intel User support
- Redact Service return_result field support
- Set custom user agent by config

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

[unreleased]: https://github.com/pangeacyber/pangea-javascript/compare/v3.0.0...main
[3.0.0]: https://github.com/pangeacyber/pangea-javascript/compare/v2.3.0...v3.0.0
[2.3.0]: https://github.com/pangeacyber/pangea-javascript/compare/v2.2.1...v2.3.0
[2.2.1]: https://github.com/pangeacyber/pangea-javascript/compare/v2.2.0...v2.2.1
[2.2.0]: https://github.com/pangeacyber/pangea-javascript/compare/v2.1.0...v2.2.0
[2.1.0]: https://github.com/pangeacyber/pangea-javascript/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/pangeacyber/pangea-javascript/compare/v1.10.0...v2.0.0
[1.10.0]: https://github.com/pangeacyber/pangea-javascript/compare/v1.9.1...v1.10.0
[1.9.1]: https://github.com/pangeacyber/pangea-javascript/compare/v1.9.0...v1.9.1
[1.9.0]: https://github.com/pangeacyber/pangea-javascript/compare/v1.8.0...v1.9.0
[1.8.0]: https://github.com/pangeacyber/pangea-javascript/compare/v1.7.0...v1.8.0
[1.7.0]: https://github.com/pangeacyber/pangea-javascript/compare/v1.6.0...v1.7.0
[1.6.0]: https://github.com/pangeacyber/pangea-javascript/compare/v1.5.0...v1.6.0
[1.5.0]: https://github.com/pangeacyber/pangea-javascript/compare/v1.4.0...v1.5.0
[1.4.0]: https://github.com/pangeacyber/pangea-javascript/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/pangeacyber/pangea-javascript/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/pangeacyber/pangea-javascript/compare/v1.1.3...v1.2.0
[1.1.3]: https://github.com/pangeacyber/pangea-javascript/compare/v1.1.2...v1.1.3
[1.1.2]: https://github.com/pangeacyber/pangea-javascript/compare/v1.1.1...v1.1.2
[1.1.1]: https://github.com/pangeacyber/pangea-javascript/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/pangeacyber/pangea-javascript/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/pangeacyber/pangea-javascript/releases/tag/v1.0.0
