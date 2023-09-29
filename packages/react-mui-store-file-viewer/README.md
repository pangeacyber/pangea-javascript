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

The Audit Log Viewer can be used to search, view, and verify tamperproofing of all logs stored by the Secure Audit Log service. It allows users to perform searches, navigate through pages of results, and interact with the audit log data.

An application using the Pangea Audit Service may also require that the audit logs are presented in the end application, because of this we made the log viewer React component that Pangea uses within it's Console available as an NPM package, such that it could be embed directly into an app.

The AuditLogViewer component is a React component built using the Material-UI (MUI) component librarby. MUI was used because it is the same component used within the Pangea Console.

## Getting Started

Install Material-UI library and the AuditLogViewer NPM package.

#### npm

```bash
npm install @mui/material @emotion/react @emotion/styled @pangeacyber/react-mui-audit-log-viewer
```

#### yarn

```bash
yarn add @mui/material @emotion/react @emotion/styled @pangeacyber/react-mui-audit-log-viewer
```

### Peer dependencies

Please note that react and react-dom are peer dependencies too:

```json
"peerDependencies": {
  "react": "^17.0.0 || ^18.0.0",
  "react-dom": "^17.0.0 || ^18.0.0"
},
```

To learn more about Material-UI (MUI) check out their official documention(https://mui.com/material-ui/getting-started/installation/).

### Props

The AuditLogViewer component accepts the following props:

- initialQuery (optional): A string representing the default initial search query.
- onSearch: A function that takes a body of type Audit.SearchRequest and returns a promise resolving to a Audit.SearchResponse. This function is called when the user performs a search. Should make a call to the Audit Service `/search` endpoint proxied through your application server.
- onPageChange: A function that takes a body of type Audit.ResultRequest and returns a promise resolving to a Audit.ResultResponse. This function is called when the user navigates to a different page of results. Should make a call to the Audit Service `/results` endpoint proxied through your application server.
- verificationOptions (optional): An object containing verification options. Letting you control whether or not to include client side verification check on audit logs.
  - onFetchRoot: A function that takes a body of type Audit.RootRequest and returns a promise resolving to a Audit.RootResponse. This function is called when the root data needs to be fetched. Should make a call to the Audit Service `/root` endpoint proxied through your application server.
  - ModalChildComponent (optional): A functional component that serves as a child component for the VerificationModal dialog.
  - onCopy (optional): A function that takes a message string and a value string. It is called when the user copies a value from the component from the VerificationModal component
- sx (optional): Additional CSS styles applied to the component using the SxProps interface.
- pageSize (optional): The number of items to display per page.
- dataGridProps (optional): Additional props to be passed to the underlying MUI DataGrid component.
- fields (optional): An object containing partial definitions for the grid columns. The keys of the object correspond to properties of the Event type, and the values are partial definitions of the GridColDef type.
- visibilityModel (optional): An object containing partial definitions for the visibility of the grid columns. The keys of the object correspond to properties of the Event type, and the values are boolean values indicating the visibility of the column.
- filters (optional): An object representing the public audit query used to filter the audit log data.
- config (optional): An object representing the authentication configuration. Used to fetch your project custom Audit schema, so the AuditLogViewer component can dyanmically update as you udpate your configuration in Pangea Console.
  - clientToken: string;
  - domain: string;
- schema (optional): An object representing the audit schema. With Audit Service custom schema support, you can change the expected Audit schema. This will control what fields are rendered.

For a deeper dive into the Prop interface check the source code [here](https://github.com/pangeacyber/pangea-javascript/blob/main/packages/react-mui-audit-log-viewer/src/AuditLogViewer.tsx)

### Example

The following is brief example for how to initialize the AuditLogViewer component.

```jsx
import React from "react";
import {
  Audit,
  AuditLogViewerProps,
  AuditLogViewer,
} from "@pangeacyber/react-mui-audit-log-viewer";

const MyComponent: React.FC = () => {
  const handleSearch = async (body: Audit.SearchRequest) => {
    // Perform search logic here
    const response = await api.searchAuditLogs(body);
    return response;
  };

  const handlePageChange = async (body: Audit.ResultRequest) => {
    // Handle page change logic here
    const response = await api.getAuditLogResults(body);
    return response;
  };

  return (
    <AuditLogViewer
      initialQuery="message:testing"
      onSearch={handleSearch}
      onPageChange={handlePageChange}
    />
  );
};
```

### Customization

The AuditLogViewer component uses the Material-UI component library, so styling of the component can be controlled through a MUI Theme. See Theming documentation [here](https://mui.com/material-ui/customization/theming/)

What to apply your Pangea branding to your end application? Check out the `@pangeacyber/react-mui-branding` NPM package [here](https://github.com/pangeacyber/pangea-javascript/tree/main/packages/react-mui-branding). The BrandingThemeProvider can fetch your Pangea Projects Branding and apply the styling to a Material-UI Theme.

## API Reference

Audit Service API's(https://pangea.cloud/docs/api/audit)

## Development

First, run the development server:

```bash
yarn install
yarn storybook
```

The `VerificationAuditLogViewer` storybook example does not use mock audit logs to render the `AuditLogViewer` instead it will read a `.env` file to hit your Audit Service Config.

Retrieve your audit service token, client token and domain from the Pangea Console Audit service dashboard and add the to a `.env` file. The enviroment file is git ignored.

```env
STORYBOOK_PANGEA_TOKEN = "{SERVICE_TOKEN}"
STORYBOOK_CLIENT_TOKEN = "{CLIENT_TOKEN}"
STORYBOOK_SERVICE_DOMAIN = "{DOMAIN}"
```

Open [http://localhost:6060](http://localhost:6060) with your browser to view the component storybook
