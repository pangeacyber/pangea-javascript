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

<br />
</p>

## Motivation

The **Audit Log Viewer** can be used to search, view, and verify tamperproofing of all logs stored by the Secure Audit Log service. It allows users to perform searches, navigate pages of results, and interact with the audit log data.

An application using the Pangea Audit Service may also require that audit logs be presented in the end application. Because of this, we made the same log viewer React component that Pangea uses in its Console available as an NPM package. This allows you to embed it directly into your app.

The `AuditLogViewer` component is a React component built using the Material-UI (MUI) library, consistent with how it appears in the Pangea Console.

## Getting Started

Install the Material-UI library and the AuditLogViewer NPM package.

#### npm

```bash
npm install @mui/material @emotion/react @emotion/styled @pangeacyber/react-mui-audit-log-viewer
```

#### yarn

```bash
yarn add @mui/material @emotion/react @emotion/styled @pangeacyber/react-mui-audit-log-viewer
```

### Peer dependencies

Please note that `react` and `react-dom` are peer dependencies too:

```json
"peerDependencies": {
  "react": "^17.0.0 || ^18.0.0",
  "react-dom": "^17.0.0 || ^18.0.0"
}
```

To learn more about Material-UI (MUI), check out the [official documentation](https://mui.com/material-ui/getting-started/installation/).

### Props

The `AuditLogViewer` component accepts the following props:

- **initialQuery** (optional): A string representing the default initial search query.
- **onSearch**: A function that takes a body of type `Audit.SearchRequest` and returns a Promise resolving to `Audit.SearchResponse`. This function is called when the user performs a search. It should make a call to the Audit Service’s `/search` endpoint via your application server.
- **searchOnChange** (optional): A boolean to toggle whether the search triggers on every input change. If `false`, a search only occurs when the user either clicks the “Search” button or presses Enter in the input. Defaults to `true`.
- **searchOnFilterChange** (optional): A boolean controlling whether a search triggers when filters change. Usually relevant if `searchOnChange` is `false`.
- **searchOnMount** (optional): A boolean controlling whether a search runs immediately upon component mount.
- **onPageChange**: A function that takes a body of type `Audit.ResultRequest` and returns a Promise resolving to `Audit.ResultResponse`. Called when the user navigates to a different page of results. Should make a call to the Audit Service’s `/results` endpoint.
- **verificationOptions** (optional): An object to enable client-side verification of tamper-proof logs.
  - **onFetchRoot**: A function that takes a body of type `Audit.RootRequest` and returns a Promise of `Audit.RootResponse`. Called when root data needs to be fetched from your server’s `/root` endpoint.
  - **ModalChildComponent** (optional): A child component for the VerificationModal dialog.
  - **onCopy** (optional): A function receiving `(message, value)`, called when users copy a value from the VerificationModal.
- **sx** (optional): Additional CSS styles using MUI’s `SxProps` interface.
- **pageSize** (optional): Number of items to display per page.
- **dataGridProps** (optional): Additional props passed to the underlying MUI `DataGrid`.
- **fields** (optional): An object whose keys map to `Event` type properties and values define partial `GridColDef` for customizing columns.
- **fieldTypes** (optional): An object mapping the audit field types (`"Boolean"`, `"DateTime"`, `"Integer"`, `"String"`, `"NonIndexed"`) to partial `GridColDef` definitions.
- **visibilityModel** (optional): An object with keys as `Event` properties and boolean values for column visibility.
- **filters** (optional): A `PublicAuditQuery` for filtering the log data.
- **config** (optional): An object representing authentication/config options. Use this if you want the component to fetch your custom Audit schema from the Pangea Console.
  - `clientToken`: string
  - `domain`: string
  - `configId`: conditionally required if you have multiple configurations in Pangea
- **schema** (optional): An object describing your custom Audit schema (fields, names, types, etc.).
- **schemaOptions** (optional): An object defining additional schema adjustments.
  - **hiddenFields** (optional): A list of field IDs to hide from both the table and filter UI.
- **fpeOptions** (optional): Options for highlighting Format Preserving Encryption (FPE) fields.
  - **highlightRedaction** (optional): Whether to highlight logs redacted with FPE.
- **filterOptions** (optional): An object defining optional filtering settings.
  - **hotStorageRange** (optional): A string representing the maximum hot storage range, used for warnings in time filter popovers.
  - **quickTimeRanges** (optional): A list of predefined time range options for quick selection.
  - **filterableFields** (optional): An array of field keys that should be included as filterable fields. Defaults to all schema fields.
  - **fieldOptions** (optional): An array of field filter options, defining available value options for specific fields.

For a deeper dive into the prop interface, see the [source code](https://github.com/pangeacyber/pangea-javascript/blob/main/packages/react-mui-audit-log-viewer/src/AuditLogViewer.tsx).

### Example

Here is a brief example of how to initialize the `AuditLogViewer` component:

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

Since `AuditLogViewer` uses Material-UI, you can style it through a standard MUI [Theme](https://mui.com/material-ui/customization/theming/).

To apply official Pangea branding to your application, consider the `@pangeacyber/react-mui-branding` NPM package. It fetches your Pangea Project’s branding and applies it to an MUI theme. See [here](https://github.com/pangeacyber/pangea-javascript/tree/main/packages/react-mui-branding) for details.

## API Reference

- [Pangea Audit Service APIs](https://pangea.cloud/docs/api/audit)

## Development

### Pre-requisites

1. Node.js v16 (IMPORTANT!)
2. yarn 1.x

To run the development server:

```bash
yarn install
yarn storybook
```

This command starts a local Storybook server at [http://localhost:6060](http://localhost:6060).

> **Note**: The [`stories` directory](./src/stories/README.md) includes various Storybook examples demonstrating advanced usage—such as custom schema overrides, theming with Material-UI, verification of tamper-proof logs, and more.

If you want to enable the `VerificationAuditLogViewer` example to fetch real logs and verify them, you’ll need to provide a `.env` file with your Pangea credentials:

```env
STORYBOOK_PANGEA_TOKEN = "{SERVICE_TOKEN}"
STORYBOOK_CLIENT_TOKEN = "{CLIENT_TOKEN}"
STORYBOOK_SERVICE_DOMAIN = "{DOMAIN}"
STORYBOOK_CONFIG_ID = "{AUDIT_CONFIG_ID}"
```

Then the component can hit your configured Pangea Audit Log service for audit logs and tamperproof verification.
