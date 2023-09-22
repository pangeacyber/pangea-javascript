<p>
  <br />
  <a href="https://pangea.cloud?utm_source=github&utm_medium=node-sdk" target="_blank" rel="noopener noreferrer">
    <img src="https://pangea-marketing.s3.us-west-2.amazonaws.com/pangea-color.svg" alt="Pangea Logo" height="40" />
  </a>
  <br />
</p>

<p>
<br />

[![documentation](https://img.shields.io/badge/documentation-pangea-blue?style=for-the-badge&labelColor=551B76)](https://pangea.cloud/docs/sdk/js/)
[![Slack](https://img.shields.io/badge/Slack-4A154B?style=for-the-badge&logo=slack&logoColor=white)](https://pangea.cloud/join-slack/)

<br />
</p>

# Pangea Vanilla Javascript Package

A javascript SDK for using Pangea Client APIs in the browser.

Client Classes

- AuthNClient: Support for interacting with AuthN `v2/client` endpoints.
- AuthNFlowClient: Support for interacting with AuthN `v2/flow` endpoints.

This package is provided with support for ESM and CommonJS.

## Installation

```sh
yarn add @pangeacyber/vanilla-js
# or
npm install @pangeacyber/vanilla-js
```

## Usage

### AuthNClient

```
import { AuthConfig, AuthNFlowClient } from "@pangeacyber/vanilla-js";

const config: AuthConfig = {
  clientToken: PANGEA_CLIENT_TOKEN,
  domain: PANGEA_DOMAIN,
  callbackUri: CALLBACK_URI
};

const client = new AuthNClient(config);

# check if a user token is valid
const resp = await client.validate(USER_TOKEN);

```

### AuthNFlowClient

```
import { AuthConfig, AuthNFlowClient } from "@pangeacyber/vanilla-js";

const config: AuthConfig = {
  clientToken: PANGEA_CLIENT_TOKEN,
  domain: PANGEA_DOMAIN,
  callbackUri: CALLBACK_URI
};

const client = new AuthNFlowClient(config);

# start a auth flow session
const resp = await client.start();

```
