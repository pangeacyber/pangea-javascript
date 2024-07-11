---
title: Quickstart
displayed_sidebar: librariesSidebar
slug: /react-mui-audit-log-viewer/
description: Redact Configuration | Enabling the service | Creating a token for the service | Enable Redact rules | Add secure Audit Log integration
image: /img/og/open-graph-redact.jpg
---

import HelpfulVote from "@src/components/HelpfulVote";
import Headline from "@src/components/Headline";

# Quickstart

<Headline>
  The Audit Log Viewer is meant to be employed with the Secure Audit Log service
  to interact with audit log data.
</Headline>

## Overview

The Audit Log Viewer can be used to search, view, and verify tamperproofing of all logs stored by the Secure Audit Log service. It allows users to perform searches, navigate through pages of results, and interact with the audit log data.

## Pangea's Secure Audit Log

The Secure Audit Log is a critical component of any system that requires accountability and transparency by providing an accurate and secure record of all system events. To learn more about integrating, configuring, and using Pangea’s Secure Audit Log Service, please take a look at our [Secure Audit Log Documentation](https://pangea.cloud/docs/audit).

## About Audit Log Viewer

- use case 1
- use case 2
- use case 3

Note: An application using the Pangea Audit Service may also require that the audit logs are presented in the end application, because of this we made the log viewer React component that Pangea uses within it's Console available as an NPM package, such that it could be embed directly into an app.

## Basic Usage

The minimal configuration is as such:
`<my-component required-prop="123"/>`

```
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

## FPE

To enable FPE highlighting do X Y Z:

`<my-component required-prop="123" fpe-highlight="true" />`

[Possibly drop in images]

## Terminology

- term1
- term2

<HelpfulVote voteId="audit-log-viewer/index" />
