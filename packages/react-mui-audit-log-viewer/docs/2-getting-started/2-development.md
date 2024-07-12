---
displayed_sidebar: librariesSidebar
description: Redact Configuration | Enabling the service | Creating a token for the service | Enable Redact rules | Add secure Audit Log integration
image: /img/og/open-graph-redact.jpg
---

# Development

### Learn how to develop the Audit Log Viewer

## Pre-requisites

1. Node.js v16 (IMPORTANT!)
2. yarn 1.x

First, run the development server:

```
yarn install
yarn storybook
```

The storybook examples do not use mock audit logs, instead it will read a `.env` file.

Retrieve your audit service token, client token and domain from the Pangea Console service dashboard and add the to a `.env` file. The environment file is git ignored.

```
STORYBOOK_PANGEA_TOKEN = "{SERVICE_TOKEN}"
STORYBOOK_CLIENT_TOKEN = "{CLIENT_TOKEN}"
STORYBOOK_SERVICE_DOMAIN = "{DOMAIN}"
```

Open http://localhost:6060 with your browser to view the component storybook
