# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Added

- AI Guard: `transformed` field.

## 5.2.0 - 2025-07-21

### Added

- AuthN: missing `group` service.

### Changed

- AI Guard: `messages` parameter is no longer a generic. It should now be a
  `{ role: string; content: string }[]`.
- AI Guard: renamed topic detector.
- File Intel: improved `hash_type` typing.

## 5.1.0 - 2025-04-25

### Added

- AuthZ: `expires_at` to tuples.
- AuthN: groups.

## 5.0.0 - 2025-04-21

### Added

- AI Guard: detector overrides.
- AI Guard: topic detector.
- AI Guard: `ignore_recipe` in detector overrides.
- `baseUrlTemplate` has been added to `PangeaConfig` to allow for greater
  control over the complete API URL. This option may be a full URL with the
  optional `{SERVICE_NAME}` placeholder, which will be replaced by the slug of
  the respective service name. This supersedes `environment` and `insecure`.

### Changed

- Redact: corrected `redaction_method_overrides` types.

### Removed

- Support for Node.js v18. The minimum supported version is now Node.js v20.
- Deprecated APIs like `PangeaConfig.configID`, `Vault.AsymmetricAlgorithm.RSA`,
  and `Vault.SymmetricAlgorithm.AES`.
- AI Guard: `llm_info` and `llm_input`.

## 4.4.0 - 2025-02-16

### Added

- AI Guard and Prompt Guard services.

### Changed

- Clarified what `PangeaConfig.environment` affects.

### Removed

- CDR and PDF support in Sanitize.

## 4.3.0 - 2025-01-13

### Added

- `file_ttl` support in Secure Share.

## 4.2.0 - 2024-12-18

### Added

- Support for `cursor` field on `v1/user/breached` of `user-intel` service.
- `vault_parameters` and `llm_request` fields support on Redact service.
- Support for `severity` field on `v1/user/breached` and `v2/user/breached` of `user-intel` service.
- `/v1/breach` endpoint support on `user-intel` service.

### Fixed

- `parameters` field in `intel` services.

## 4.1.0 - 2024-10-16

### Added

- Secure Share service support.
- Multiple bucket ID support to Share.
- `metadata_protected` and `tags_protected` support to Share `ItemData`
- `password` and `password_algorithm` support to Share
- Filter fields to `filter_list` on Share service
- `objects` field to Share `GetArchiveResult`
- `title` and `message` to Share `ShareCreateLinkItem`

## 4.0.0 - 2024-10-15

### Added

- Detect-only Redact for Sanitize.
- Support for `domains` field in `v2/user/breached` endpoint in User Intel service.
- Vault KEM export support.

### Changed

- Vault v2 APIs support.

## 3.12.0 - 2024-09-25

### Added

- Sanitize service support.

### Fixed

- Event canonicalization of characters like a-circumflex and the replacement
  character.

## 3.11.0 - 2024-07-30

### Added

- `attributes` field in `/list-resources` and `/list-subjects` endpoint
- Added full error response payloads to API error messages to improve debugging experience when running into validation error issues.

### Fixed

- AuthN `getProfile()` TSDoc example.
- Non-ASCII values not being escaped properly during event canonicalization.

### Changed

- Service constructors now support Vault service's `GetResult` type as well as strings as tokens.

## [3.10.0] - 2024-07-16

### Added

- Improvements in verification of Audit consistency proofs
- CommonJS support.
- Vault `/export` support.
- AuthN user password expiration support.
- `"state"` and other new properties to `AuthN.User.Authenticators.Authenticator`.

### Changed

- `enable` in `AuthN.User.Authenticators.Authenticator` has been renamed to
  `enabled`. The previous name did not match the name used in the API's response
  schema so it was unusable anyways.

## [3.9.0] - 2024-06-07

### Added

- `fpe_context` field in Audit search events
- `return_context` support in Audit `/search`, `/results` and `/download` endpoints
- Redact `/unredact` endpoint support
- `redaction_method_overrides` field support in `/redact` and `redact_structured` endpoints
- AuthN usernames support.
- Support for format-preserving encryption.

### Changed

- `BaseService.post()` is now `protected` and `@internal`, as it was never meant
  for public use.

### Removed

- Beta tags from AuthZ.

## [3.8.0] - 2024-05-10

Note that Sanitize and Secure Share did not make it into this release.

### Added

- Documentation to service client configuration.
- Audit /download_results endpoint support
- Documentation to service client constructors.
- Support for Secure Audit Log's log stream API.
- Support for Secure Audit Log's export API.
- AuthZ service support.

### Fixed

- Put to presigned url. It should just put file in raw, not in form format.

### Removed

- Unused `options` documentation in `UserIntelService`.

## [3.7.0] - 2024-02-26

### Added

- `rotation_state` field support in key rotation in Vault service.
- Vault service. Post quantum signing algorithms support

### Changed

- Rewrote `README.md`.
- The dependency on node-rs/crc32 has been replaced by one on aws-crypto/crc32c,
  a pure-JS implementation of CRC32C.

## [3.6.0] - 2024-01-12

### Added

- Vault encrypt structured support.

## [3.5.0] - 2023-12-18

### Added

- File Intel /v2/reputation support
- IP Intel /v2/reputation, /v2/domain, /v2/proxy, v2/vpn and /v2/geolocate support
- URL Intel /v2/reputation support
- Domain Intel /v2/reputation support
- User Intel /v2/user/breached and /v2/password/breached support

## [3.4.0] - 2023-12-07

### Changed

- 202 result format

### Removed

- accepted_status in 202 result

### Added

- put_url, post_url, post_form_data fields in 202 result

## [3.3.0] - 2023-11-28

### Added

- Authn unlock user support
- Redact multiconfig support
- File Scan post-url and put-url support

## [3.2.0] - 2023-11-15

### Added

- Support for audit /v2/log and /v2/log_async endpoints

## [3.1.0] - 2023-11-09

### Added

- Presigned URL upload support on FileScan service
- Folder settings support in Vault service

## [3.0.0] - 2023-10-23

### Added

- AuthN v2 support

### Removed

- AuthN v1 support

## [2.3.0] - 2023-09-26

### Added

- FileScan Reversinglabs provider example
- Domain WhoIs endpoint support

### Changed

- Deprecated config_id in PangeaConfig. Now is set in service initialization.

### Fixed

- HashType supported in File Intel

## [2.2.1] - 2023-09-14

### Added

- Authn dropped use_new parameter for user listing

## [2.2.0] - 2023-09-05

### Added

- Redact rulesets field support
- FileScan service support

## [2.1.0] - 2023-07-14

### Added

- Vault /folder/create endpoint support

## [2.0.0] - 2023-07-06

### Changed

- Event interface is now a key:object map
- Rename some result interfaces with "result" postfix
- Create new Intel request/result interfaces per service

### Removed

- Intel services all deprecated methods
- Audit.Log options: Remove signMode due to vault signing is done by token

## [1.10.0] - 2023-06-26

### Added

- Multiconfig support
- Instructions to setup token and domain in examples

## [1.9.1] - 2023-06-08

### Added

- Defang examples
- Intel IP /domain, /vpn and /proxy endpoint examples

### Changed

- Intel User password breached full workflow example
- Update got package to fix vulnerability

### Fixed

- Redact service was ignoring return_result param

## [1.9.0] - 2023-05-25

### Added

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

[unreleased]: https://github.com/pangeacyber/pangea-javascript/compare/v3.7.0...main
[3.7.0]: https://github.com/pangeacyber/pangea-javascript/compare/v3.6.0...v3.7.0
[3.6.0]: https://github.com/pangeacyber/pangea-javascript/compare/v3.5.0...v3.6.0
[3.5.0]: https://github.com/pangeacyber/pangea-javascript/compare/v3.4.0...v3.5.0
[3.4.0]: https://github.com/pangeacyber/pangea-javascript/compare/v3.3.0...v3.4.0
[3.3.0]: https://github.com/pangeacyber/pangea-javascript/compare/v3.2.0...v3.3.0
[3.2.0]: https://github.com/pangeacyber/pangea-javascript/compare/v3.1.0...v3.2.0
[3.1.0]: https://github.com/pangeacyber/pangea-javascript/compare/v3.0.0...v3.1.0
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
