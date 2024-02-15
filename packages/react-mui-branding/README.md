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

## Motivation

The BrandingThemeProvider can be used wrap your application in a Material-UI ThemeProvider, that has default ThemeOptions built from your fetched Pangea branding configurations.

## Getting Started

Install Material-UI library and the BrandingThemeProvider NPM package.

#### npm

```bash
npm install @mui/material @emotion/react @emotion/styled @pangeacyber/react-mui-branding
```

#### yarn

```bash
yarn add @mui/material @emotion/react @emotion/styled @pangeacyber/react-mui-branding
```

### Peer dependencies

Please note that react and react-dom are peer dependencies too:

```json
"peerDependencies": {
  "react": "^17.0.0 || ^18.0.0",
  "react-dom": "^17.0.0 || ^18.0.0"
},
```

To learn more about Material-UI (MUI) check out their official documentation(https://mui.com/material-ui/getting-started/installation/).

### Props

The BrandingThemeProvider component accepts the following props:

- themeOptions (optional): Material UI theme options for the MUI ThemeProvider. If Pangea branding configuration data is fetched, it will merge the build themeOptions with the themeOptions prop.
- children (optional): JSX Element to render as children
- auth (optional): An object representing the authentication configuration. Used to fetch your branding configurations from Pangea
  - clientToken: string;
  - domain: string;
- brandingId (optional): Found in the Project -> Branding page within console is required along with "auth" in order to retrieve Pangea branding configurations.
- ThemeProviderProps (optional): An object container MUI ThemeProvider props overrides

For a deeper dive into the Prop interface check the source code [here](https://github.com/pangeacyber/pangea-javascript/blob/main/packages/react-mui-branding/src/components/BrandingThemeProvider/index.tsx)

### Example

The following is a brief example on how to initialize the AuditLogViewer component.

```jsx
import React from "react";
import { BrandingThemeProvider } from "@pangeacyber/react-mui-branding";

const MyComponent: React.FC = () => {
  return (
    <BrandingThemeProvider
      brandingId={process.env.REACT_APP_BRANDING_ID}
      auth={{
        clientToken: process.env.REACT_APP_CLIENT_TOKEN,
        domain: "aws.us.pangea.cloud",
      }}
    />
  );
};
```

### Customization

The BrandingThemeProvider component is primarily a light wrapper around the Material-UI component library, ThemeProvider component. so styling of the component can be controlled through a MUI Theme. See Theming documentation [here](https://mui.com/material-ui/customization/theming/)
