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

Take note of the **Domain**, **Client Token** and **Hosted Login** values in the "Configuration Details" panel on the "Overview" page. You'll need these values in the next step.

### Configure the SDK

Configure the SDK by wrapping your application in `AuthProvider`:

```jsx
// src/index.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { AuthProvider } from "@pangeacyber/react-auth";

const App = () => {
  const navigate = useNavigate();

  return (
    <AuthProvider
      loginUrl="YOUR_HOSTED_LOGIN_URL"
      config={{
        domain: "YOUR_PANGEA_DOMAIN",
        clientToken: "YOUR_CLIENT_TOKEN",
      }}
    >
      <App />
    </AuthProvider>
  );
};
```

Use the `useAuth` hook in your components to access authentication state.

```jsx
// src/App.js
import React from "react";

import { useAuth } from "@pangeacyber/react-auth";

const App = () => {
  const { authenticated, loading, error, user, login, logout } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <div>Loading</div>;
  } else if (error) {
    return <div>Error: {error}</div>;
  }

  if (authenticated) {
    return (
      <div>
        Logged in as {user.profile.first_name}
        <button onClick={logout}>Logout</button>
      </div>
    );
  } else {
    return (
      <div>
        <button onClick={login}>Login</button>
      </div>
    );
  }
};

export default App;
```

### Configuration Options

Required Configuration

- **loginUrl** The URL of the hosted login page
- **config**
  - **domain** The Pangea domain of the project
  - **clientToken** A Pangea client access token

Optional Configuration

Additional `config` object parameters
**config**

- **callbackUri** The URI that the hosted page will redirect to after a login or logout. Defaults to `window.location.origin`.
- **useJwt** Use JSON Web Tokens for authentication. The AuthN Service must all be configured to use JWTs.
- **sessionKey** The key name used for session information. Defaults to `pangea-session`.

Cookie configuration parameters
**cookieOptions**

- **useCookie** The AuthProvider will store tokens using cookies and enable session sharing in a browser and across subdomains. Defaults to false.
- **cookieMaxAge** The lifetime of session cookies in seconds. Defaults to 48 hours.
- **cookieName** The name of the user token cookie. Defaults to `pangea-token`.
- **refreshCookieName** The name of the refresh token cookie. Defaults to `pangea-refresh`.
- **cookieDomain** The domain to set on the cookie.

Additional AuthProvider Props

- **onLogin** A function to call on successful login. Defaults to `undefined`.
- **redirectPathname** A path to append to the redirectUri on successful login. Defaults to `undefined`.
- **redirectOnLogout** When set to true, redirect to the hosted login page on logout. Defaults to `false`.
- **useStrictStateCheck** Verify the state value on login. Defaults to `true`.
