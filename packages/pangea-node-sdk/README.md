<a href="https://pangea.cloud?utm_source=github&utm_medium=node-sdk" target="_blank" rel="noopener noreferrer">
  <img src="https://pangea-marketing.s3.us-west-2.amazonaws.com/pangea-color.svg" alt="Pangea Logo" height="40" />
</a>

<br />

[![documentation](https://img.shields.io/badge/documentation-pangea-blue?style=for-the-badge&labelColor=551B76)][Documentation]
[![Slack](https://img.shields.io/badge/Slack-4A154B?style=for-the-badge&logo=slack&logoColor=white)][Slack]

# Pangea Node.js SDK

A Node.js SDK for integrating with Pangea services. Supports Node.js v18 and
v20.

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
$ npm install pangea-node-sdk@3.8.0-beta.2
```

Via yarn:

```bash
$ yarn add pangea-node-sdk@3.8.0-beta.2
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

[Documentation]: https://pangea.cloud/docs/sdk/js/
[GA Examples]: https://github.com/pangeacyber/pangea-javascript/tree/main/examples
[Beta Examples]: https://github.com/pangeacyber/pangea-javascript/tree/beta/examples
[Pangea Console]: https://console.pangea.cloud/
[Slack]: https://pangea.cloud/join-slack/
[Secure Audit Log]: https://pangea.cloud/docs/audit
