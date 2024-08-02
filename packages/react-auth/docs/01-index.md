---
title: Overview
displayed_sidebar: react-auth
slug: /libraries/react-auth/
description: Learn how to use the React Auth components from Pangea in your app
# image: /img/og/open-graph-redact.jpg # TODO
---

## Overview

This React Auth package provides components and tools which can be used to provide your application with authentication powered by Pangea's AuthN service.

Pangea's AuthN service allows you to build a cloud-based authentication flow to help your login, session, and user management align with your security requirements while matching the look and feel of your app. The components and utilities in this package help you manage your application authentication sessions and state with AuthN.

## Installation

Using [npm](https://npmjs.org/)

```bash
npm install @pangeacyber/react-auth
```

Using [yarn](https://yarnpkg.com/)

```bash
yarn add @pangeacyber/react-auth
```

## Components

### [AuthProvider](./api-reference/#AuthProvider)

A content provider for adding authentication using Pangea hosted pages.

### [ComponentAuthProvider](./api-reference/#ComponentAuthProvider)

A context provider for implementing UI-only authentication using AuthN Flow endpoints.

### [AuthNClient](./api-reference/#AuthNClient)

A client class for using common AuthN client endpoints.

### [AuthNFlow](./api-reference/#AuthNFlow)

A context provider and client for implementing authentication using AuthN Flow endpoints.
