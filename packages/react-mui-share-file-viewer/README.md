\*\*\*\*<p>
<br />
<a href="https://pangea.cloud?utm_source=github&utm_medium=node-sdk" target="_blank" rel="noopener noreferrer">
<img src="https://pangea-marketing.s3.us-west-2.amazonaws.com/pangea-color.svg" alt="Pangea Logo" height="40" />
</a>
<br />

</p>

<p>
<br />

[![documentation](https://img.shields.io/badge/documentation-pangea-blue?style=for-the-badge&labelColor=551B76)](https://pangea.cloud/docs/sdk/js/)
[![Discourse](https://img.shields.io/badge/Discourse-4A154B?style=for-the-badge&logo=discourse&logoColor=white)](https://l.pangea.cloud/Jd4wlGs)

<br />
</p>

## Motivation

The Share File Viewer can be used to search, view, and upload files or folders to your Pangea Secure Share.

An application using the Secure Share may also require that files are presented in the end application, because of this we made the file viewer React component that Pangea uses within its Console available as an NPM package, such that it could be embedded directly into other applications. The primary prop required is an API interface, which should contain callback handlers that handle making API requests to a server which proxies the Secure Share APIs. A proxy server is required because the service token from Pangea should not be embedded within a client.

The ShareFileViewer component is a React component built using the Material-UI (MUI) component library. MUI was used because it is the same component used within the Pangea Console.

## Getting Started

Install Material-UI library and the AuditLogViewer NPM package.

#### npm

```bash
npm install @mui/material @emotion/react @emotion/styled @pangeacyber/react-mui-share-file-viewer
```

#### yarn

```bash
yarn add @mui/material @emotion/react @emotion/styled @pangeacyber/react-mui-share-file-viewer
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

## ShareFileViewerProps Interface

### Description

The `ShareFileViewerProps` interface defines properties for configuring a file viewer component that interacts with a Secure Share service through the provided `ShareProxyApiRef`.

### Interface Definition

```typescript
interface ShareFileViewerProps {
  children?: React.ReactNode;
  apiRef: ShareProxyApiRef;
  configurations?: ShareConfigurations;
  defaultFilter?: ObjectStore.Filter;
  defaultSort?: "asc" | "desc";
  defaultSortBy?: keyof ObjectStore.ObjectResponse;

  defaultVisibilityModel?: Record<string, boolean>;
  defaultColumnOrder?: string[];

  customizations?: StoreDataGridCustomizations;

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
- `customizations` (StoreDataGridCustomizations, optional): Provide customization to rendered grid columns
- `defaultColumnOrder` (string[], optional): Default order of columns in the file viewer.
- `includeIdColumn` (boolean, optional): Toggle whether to include the object id as an new column. Defaulted to false;
- `PangeaDataGridProps` (Partial<PangeaDataGridProps<ObjectStore.ObjectResponse>>, optional): Customization options for the internal PangeaDataGrid component used by the ShareFileViewer. From @pangeacyber/react-mui-shared.

## ShareProxyApiRef Interface

### Description

The `ShareProxyApiRef` interface defines methods and properties for interacting with a store proxy API. It includes functions for listing, getting, archiving, sharing, deleting, updating, uploading, and creating folders in the object store.

Only `list` and `get` are required to run the ShareFileViewer.

### Interface Definition

```typescript
interface ShareProxyApiRef {
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

For a deeper dive into the Prop interface check the source code [here](https://github.com/pangeacyber/pangea-javascript/blob/main/packages/react-mui-share-file-viewer/src/components/ShareFileViewer/index.tsx).

## Example

The following is brief example for how to initialize the AuditLogViewer component.

```jsx
import React from "react";
import {
  ShareProxyApiRef,
  ShareFileViewer,
} from "@pangeacyber/react-mui-share-file-viewer";

const storeCallbackHandler: ShareProxyApiRef = {
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
  return <ShareFileViewer apiRef={storeCallbackHandler} />;
};
```

## Customization

The ShareFileViewer component uses the Material-UI component library, so styling of the component can be controlled through a MUI Theme. See Theming documentation [here](https://mui.com/material-ui/customization/theming/)

What to apply your Pangea branding to your end application? Check out the `@pangeacyber/react-mui-branding` NPM package [here](https://github.com/pangeacyber/pangea-javascript/tree/main/packages/react-mui-branding). The BrandingThemeProvider can fetch your Pangea Projects Branding and apply the styling to a Material-UI Theme.

## API Reference

Secure Share Service API's(https://pangea.cloud/docs/api/store)

## Development

First, run the development server:

```bash
yarn install
yarn storybook
```

The `ShareFileViewer.stories.tsx` storybook example does not use mock files to render the `ShareFileViewer` instead it will read a `.env` file to hit your Share Service Config.

Retrieve your Secure Share service token, client token and domain from the Pangea Console Share service dashboard and add the following to a `.env` file. The environment file is git ignored.

```env
STORYBOOK_PANGEA_TOKEN = "{SERVICE_TOKEN}"
STORYBOOK_CLIENT_TOKEN = "{CLIENT_TOKEN}"
STORYBOOK_SERVICE_DOMAIN = "{DOMAIN}"
```

Open [http://localhost:6060](http://localhost:6060) with your browser to view the component storybook
