---
title: Overview
displayed_sidebar: react-mui-audit-log-viewer
slug: /libraries/react-mui-audit-log-viewer/
description: Learn how to use the Secure Audit Log Viewer components from Pangea in your app
# image: /img/og/open-graph-redact.jpg # TODO
---

# Overview

The Audit Log Viewer can be used to search, view, and verify tamperproofing of all logs stored by the Secure Audit Log service. It allows users to perform searches, navigate through pages of results, and interact with the audit log data.

An application using the Pangea Audit Service may also require that the audit logs are presented in the end application, because of this we made the log viewer React component that Pangea uses within its Console available as an npm package, such that it could be embed directly into an app.

The AuditLogViewer component is a React component built using the Material-UI (MUI) component library. MUI was used because it is the same component used within the Pangea Console.

## Pangea's Secure Audit Log

The Secure Audit Log is a critical component of any system that requires accountability and transparency by providing an accurate and secure record of all system events. To learn more about integrating, configuring, and using Pangea’s Secure Audit Log Service, please take a look at our [Secure Audit Log Documentation](https://pangea.cloud/docs/audit).

## Basic Usage

```tsx
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

## Format Preserving Encryption (FPE) Support

To enable FPE highlighting set the `highlightRedaction` FPE option to `true`

```tsx
<AuditLogViewer
  fpeOptions={{
    highlightRedaction: true,
  }}
/>
```
