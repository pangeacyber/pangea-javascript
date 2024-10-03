---
title: Overview
displayed_sidebar: react-mui-share-file-viewer
slug: /libraries/react-mui-share-file-viewer/
description: Learn how to use the Secure Share Viewer components from Pangea in your app
# image: /img/og/open-graph-redact.jpg # TODO
---

# Overview

The Share File Viewer can be used to search, view, and upload files or folders to your Pangea Secure Share.

An application using the Secure Share may also require that files are presented in the end application, because of this we made the file viewer React component that Pangea uses within its Console available as an NPM package, such that it could be embedded directly into other applications. The primary prop required is an API interface, which should contain callback handlers that handle making API requests to a server which proxies the Secure Share APIs. A proxy server is required because the service token from Pangea should not be embedded within a client.

The ShareFileViewer component is a React component built using the Material-UI (MUI) component library. MUI was used because it is the same component used within the Pangea Console.

## Pangea's Secure Audit Log

The Secure Share is a critical component of any system that requires sharing files across users. To learn more about integrating, configuring, and using Pangea’s Secure Share Service, please take a look at our [Secure Share Documentation](https://pangea.cloud/docs/share).

## Basic Usage

```tsx
import React from "react";
import {
  ShareProxyApiRef,
  ShareFileViewer,
} from "@pangeacyber/react-mui-share-file-viewer";

const ShareCallbackHandler: ShareProxyApiRef = {
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
  return <ShareFileViewer apiRef={ShareCallbackHandler} />;
};
```
