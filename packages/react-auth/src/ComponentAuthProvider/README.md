# Pangea ComponentAuthProvider

Providers support for authentication using AuthN Flow UI Components

## Getting started

### Installation

Using [npm](https://npmjs.org/)

```bash
npm install @pangeacyber/react-auth
```

Using [yarn](https://yarnpkg.com/)

```bash
yarn add @pangeacyber/react-auth
```

### Configure Pangea AuthN

Enable the **AuthN Service** in the [Pangea Console](https://console.pangea.cloud).

> **If you're using an existing application**, verify that you have configured the following settings for AuthN:
>
> - Under "Auth Methods", ensure "Password" authentication is enabled.
> - Under "Redirects", configure a redirect that reflects the origin of your application. For local development that might be `http://localhost:3000`
> - In the "Auth Settings" section, enable "Allow Signups".

Take note of the **Domain** and **Client Token** values in the "Configuration Details" panel on the "Overview" page. You'll need these values in the next step.

### Configure the SDK

Configure the SDK by wrapping your application in `ComponentAuthProvider`:

```jsx
// src/index.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { ComponentAuthProvider } from "@pangeacyber/react-auth";

const App = () => {
  const navigate = useNavigate();

  return (
    <ComponentAuthProvider
      config={{
        domain: "YOUR_PANGEA_DOMAIN",
        clientToken: "YOUR_CLIENT_TOKEN",
      }}
    >
      <App />
    </ComponentAuthProvider>
  );
};
```
