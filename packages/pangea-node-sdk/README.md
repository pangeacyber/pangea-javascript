<a href="https://pangea.cloud?utm_source=github&utm_medium=node-sdk" target="_blank" rel="noopener noreferrer">
  <img src="https://pangea-marketing.s3.us-west-2.amazonaws.com/pangea-color.svg" alt="Pangea Logo" height="40" />
</a>

<br />

[![Documentation](https://img.shields.io/badge/documentation-pangea-blue?style=for-the-badge&labelColor=551B76)][Documentation]

# Pangea Node.js SDK

A Node.js SDK for integrating with Pangea services. Supports Node.js v20 and
v22.

## Installation

#### GA releases

Via npm:

```bash
$ npm install pangea-node-sdk
```

Via yarn:

```bash
$ yarn add pangea-node-sdk
```

<a name="beta-releases"></a>

#### Beta releases

Pre-release versions may be available with the `beta` denotation in the version
number. These releases serve to preview beta services and APIs. Per Semantic
Versioning, they are considered unstable and do not carry the same compatibility
guarantees as stable releases. [Beta changelog](https://github.com/pangeacyber/pangea-javascript/blob/beta/packages/pangea-node-sdk/CHANGELOG.md).

Via npm:

```bash
$ npm install pangea-node-sdk@5.2.0-beta.3
```

Via yarn:

```bash
$ yarn add pangea-node-sdk@5.2.0-beta.3
```

## Usage

- [Documentation][]
- [GA Examples][]
- [Beta Examples][]

General usage would be to create a token for a service through the
[Pangea Console][] and then construct an API client for that respective service.
The below example shows how this can be done for [Secure Audit Log][] to log a
simple event:

```typescript
import process from "node:process";
import { PangeaConfig, AuditService } from "pangea-node-sdk";

// Load client configuration from environment variables `PANGEA_AUDIT_TOKEN` and
// `PANGEA_DOMAIN`.
const token = process.env.PANGEA_AUDIT_TOKEN;
const config = new PangeaConfig({ domain: process.env.PANGEA_DOMAIN });

// Create a Secure Audit Log client.
const audit = new AuditService(token, config);

// Log a basic event.
const response = await audit.log({ message: "Hello, World!" });
```

## Configuration

The SDK supports the following configuration options via `PangeaConfig`:

- `baseUrlTemplate` — Template for constructing the base URL for API requests.
  The placeholder `{SERVICE_NAME}` will be replaced with the service name slug.
  This is a more powerful version of `domain` that allows for setting more than
  just the host of the API server.
  Defaults to `https://{SERVICE_NAME}.aws.us.pangea.cloud`.
- `domain` — Base domain for API requests. This is a weaker version of
  `baseUrlTemplate` that only allows for setting the host of the API server. Use
  `baseUrlTemplate` for more control over the URL, such as setting
  service-specific paths. Defaults to `aws.us.pangea.cloud`.
- `requestRetries` — How many times a request should be retried on failure.
  Defaults to `3`.
- `requestTimeout` — Maximum allowed time (in milliseconds) for a request to
  complete. Defaults to `5000`.
- `queuedRetryEnabled` — Whether or not queued request retries are enabled.
  Defaults to `true`.
- `queuedRetries` — How many queued request retries there should be on failure.
  Defaults to `4`.
- `pollResultTimeoutMs` — Timeout for polling results after a HTTP/202
  (in milliseconds). Defaults to `120 * 1000`.
- `customUserAgent` — User-Agent string to append to the default one.

[Documentation]: https://pangea.cloud/docs/sdk/js/
[GA Examples]: https://github.com/pangeacyber/pangea-javascript/tree/main/examples
[Beta Examples]: https://github.com/pangeacyber/pangea-javascript/tree/beta/examples
[Pangea Console]: https://console.pangea.cloud/
[Secure Audit Log]: https://pangea.cloud/docs/audit
