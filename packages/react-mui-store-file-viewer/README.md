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

The Store Viewer can be used to search, view, and upload files or folders to your Pangea Secure Object Store.

An application using the Secure Object Store may also require that files are presented in the end application, because of this we made the file viewer React component that Pangea uses within it's Console available as an NPM package, such that it could be embed directly into an app. The primary prop require is an api interface, which should contain callback handlers that handle making API requests to a server which proxy the Secure Object Store APIs, expecting a proxy server since service token from Pangeas should not be embed within a client.

The StoreFileViewer component is a React component built using the Material-UI (MUI) component library. MUI was used because it is the same component used within the Pangea Console.

## Getting Started

Install Material-UI library and the AuditLogViewer NPM package.

#### npm

```bash
npm install @mui/material @emotion/react @emotion/styled @pangeacyber/react-mui-store-file-viewer
```

#### yarn

```bash
yarn add @mui/material @emotion/react @emotion/styled @pangeacyber/react-mui-store-file-viewer
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

## StoreFileViewerProps Interface

### Description

The `StoreFileViewerProps` interface defines properties for configuring a file viewer component that interacts with a Secure Object Store service through the provided `StoreProxyApiRef`.

### Interface Definition

```typescript
interface StoreFileViewerProps {
  children?: React.ReactNode;
  apiRef: StoreProxyApiRef;
  configurations?: StoreConfigurations;
  defaultFilter?: ObjectStore.Filter;
  defaultSort?: "asc" | "desc";
  defaultSortBy?: keyof ObjectStore.ObjectResponse;

  defaultVisibilityModel?: Record<string, boolean>;
  defaultColumnOrder?: string[];

  PangeaDataGridProps?: Partial<
    PangeaDataGridProps<ObjectStore.ObjectResponse>
  >;
}
```

### Props

- `children` (ReactNode, optional): Child components or elements.
- `apiRef` (StoreProxyApiRef, required): Reference to the store proxy API for communication with the object store.
- `configurations` (StoreConfigurations, optional): Configuration options for the file viewer.
- `defaultFilter` (ObjectStore.Filter, optional): Default filter to apply to the file viewer.
- `defaultSort` ("asc" | "desc", optional): Default sorting order for the file viewer.
- `defaultSortBy` (keyof ObjectStore.ObjectResponse, optional): Default property to sort the file viewer by.
- `defaultVisibilityModel` (Record<string, boolean>, optional): Default visibility model for elements in the file viewer.
- `defaultColumnOrder` (string[], optional): Default order of columns in the file viewer.
- `PangeaDataGridProps` (Partial<PangeaDataGridProps<ObjectStore.ObjectResponse>>, optional): Customization options for the internal PangeaDataGrid component used by the StoreFileViewer.From @pangeacyber/react-mui-shared

## StoreProxyApiRef Interface

### Description

The `StoreProxyApiRef` interface defines methods and properties for interacting with a store proxy API. It includes functions for listing, getting, archiving, sharing, deleting, updating, uploading, and creating folders in the object store.

Only list and get are required to run the StoreFileViewer.

### Interface Definition

```typescript
interface StoreProxyApiRef {
  list:
    | ((
        data: ObjectStore.ListRequest
      ) => Promise<PangeaResponse<ObjectStore.ListResponse>>)
    | undefined;
  get:
    | ((
        data: ObjectStore.GetRequest
      ) => Promise<PangeaResponse<ObjectStore.GetResponse>>)
    | undefined;

  getArchive?:
    | ((
        data: ObjectStore.GetArchiveRequest
      ) => Promise<PangeaResponse<ObjectStore.GetArchiveResponse>>)
    | undefined;

  share?: {
    list?: (
      data: ObjectStore.ListRequest
    ) => Promise<PangeaResponse<ObjectStore.ShareListResponse>>;
    get?: (
      data: ObjectStore.ShareGetRequest
    ) => Promise<PangeaResponse<ObjectStore.ShareObjectResponse>>;
    delete?: (data: ObjectStore.ShareDeleteRequest) => Promise<PangeaResponse>;
    create?: (
      data: ObjectStore.ShareCreateRequest
    ) => Promise<PangeaResponse<ObjectStore.SharesObjectResponse>>;
    send?: (
      data: ObjectStore.ShareSendRequest
    ) => Promise<PangeaResponse<ObjectStore.ShareSendResponse>>;
  };

  delete?: (
    data: ObjectStore.DeleteRequest
  ) => Promise<PangeaResponse<ObjectStore.DeleteResponse>>;
  update?: (
    data: ObjectStore.UpdateRequest
  ) => Promise<PangeaResponse<ObjectStore.UpdateResponse>>;

  upload?: (
    data: FormData,
    contentType: "multipart/form-data"
  ) => Promise<PangeaResponse<ObjectStore.PutResponse>>;
  folderCreate?: (
    data: ObjectStore.FolderCreateRequest
  ) => Promise<PangeaResponse<ObjectStore.FolderCreateResponse>>;
}
```

For a deeper dive into the Prop interface check the source code [here](https://github.com/pangeacyber/pangea-javascript/blob/main/packages/react-mui-store-file-viewer/src/components/StoreFileViewer/index.tsx)

## Example

The following is brief example for how to initialize the AuditLogViewer component.

```jsx
import React from "react";
import {
  StoreProxyApiRef,
  StoreFileViewer,
} from "@pangeacyber/react-mui-store-file-viewer";

const storeCallbackHandler: StoreProxyApiRef = {
  get: async (data) => {
    const response = await api.storeGet(data);
    return response;
  },
  list: async (data) => {
    const response = await api.storeList(data);
    return response;
  },
};

const MyComponent: React.FC = () => {
  return <StoreFileViewer apiRef={storeCallbackHandler} />;
};
```

## Customization

The StoreFileViewer component uses the Material-UI component library, so styling of the component can be controlled through a MUI Theme. See Theming documentation [here](https://mui.com/material-ui/customization/theming/)

What to apply your Pangea branding to your end application? Check out the `@pangeacyber/react-mui-branding` NPM package [here](https://github.com/pangeacyber/pangea-javascript/tree/main/packages/react-mui-branding). The BrandingThemeProvider can fetch your Pangea Projects Branding and apply the styling to a Material-UI Theme.

## API Reference

Store Service API's(https://pangea.cloud/docs/api/store)

## Development

First, run the development server:

```bash
yarn install
yarn storybook
```

The `StoreFileViewer.stories.tsx` storybook example does not use mock files to render the `StoreFileViewer` instead it will read a `.env` file to hit your Store Service Config.

Retrieve your Secure Object Store service token, client token and domain from the Pangea Console Store service dashboard and add the following to a `.env` file. The enviroment file is git ignored.

```env
STORYBOOK_PANGEA_TOKEN = "{SERVICE_TOKEN}"
STORYBOOK_CLIENT_TOKEN = "{CLIENT_TOKEN}"
STORYBOOK_SERVICE_DOMAIN = "{DOMAIN}"
```

Open [http://localhost:6060](http://localhost:6060) with your browser to view the component storybook
