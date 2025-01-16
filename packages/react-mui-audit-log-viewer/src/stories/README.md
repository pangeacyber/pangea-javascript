# Storybook Examples

This directory contains multiple Storybook examples demonstrating how to use and configure the **AuditLogViewer** component in different scenarios (e.g., custom schemas, themed UIs, verification features).

## Table of Contents

- [Storybook Examples](#storybook-examples)
  - [Table of Contents](#table-of-contents)
  - [AuditLogViewer.stories.tsx (Standard Example)](#auditlogviewerstoriestsx-standard-example)
  - [CustomSchemaAuditLogViewer.stories.tsx](#customschemaauditlogviewerstoriestsx)
  - [BrandedAuditLogViewer.stories.tsx (Themed Example)](#brandedauditlogviewerstoriestsx-themed-example)
  - [DefaultsAuditLogViewer.stories.tsx](#defaultsauditlogviewerstoriestsx)
  - [VerificationAuditLogViewer.stories.tsx](#verificationauditlogviewerstoriestsx)
  - [Environment Variables](#environment-variables)
  - [Contributing](#contributing)

---

## AuditLogViewer.stories.tsx (Standard Example)

**Purpose**: Demonstrates a minimal configuration for the `AuditLogViewer`:

- **Required Callbacks**:
  - `onSearch`: Invoked when the user performs a search.
  - `onPageChange`: Invoked when the user navigates between pages of results.
- **Optional**:
  - `config`: If you provide the right environment variables (e.g., `STORYBOOK_CLIENT_TOKEN`), the viewer can fetch a **custom** Audit schema from your Audit Log service.
- **Environment Variables**:
  - `STORYBOOK_PANGEA_TOKEN`, `STORYBOOK_SERVICE_DOMAIN`, `STORYBOOK_CONFIG_ID`, `STORYBOOK_CLIENT_TOKEN`, etc.

---

## CustomSchemaAuditLogViewer.stories.tsx

**Purpose**: Shows how to override the default schema by providing a custom definition via the `schema` prop.

- **Key Prop**: `schema`, which controls which fields are displayed, how they are named, and their types (e.g., `datetime`, `string`).
- **Typical Callbacks**:
  - `onSearch` and `onPageChange` to fetch results and handle pagination.

Use this example to see how changing the schema can tailor columns to specific needs or highlight custom fields.

---

## BrandedAuditLogViewer.stories.tsx (Themed Example)

**Purpose**: Demonstrates wrapping the `AuditLogViewer` in a custom Material UI theme from `@pangeacyber/react-mui-branding`.

- **Theme Provider**: A custom `BrowserflixThemeProvider` (example name) applies brand styles that the `AuditLogViewer` inherits because it’s built with MUI components.
- **Download Callback**:
  - `onDownload`: Adds a **Download** button for exporting logs.

This story highlights how theming can unify the look and feel of the `AuditLogViewer` with the rest of your application.

---

## DefaultsAuditLogViewer.stories.tsx

**Purpose**: Demonstrates dynamic user-driven configuration of `initialQuery` and `filters.range` (e.g., _relative_, _between_, _before_, _after_).

- **UI Interactions**:
  - Text and date inputs let the user specify the query parameters.
  - An **Apply** button updates the component with the new state.
- **Callback Props**:
  - `onSearch`, `onPageChange` — same as the standard example, but now combined with user-driven filter updates.

Use this example to see a more advanced user-experience pattern where the UI updates the search or filter parameters at runtime.

---

## VerificationAuditLogViewer.stories.tsx

**Purpose**: Demonstrates the tamper-proof verification feature.

- **Key Prop**:
  - `verificationOptions.onFetchRoot`: Fetches the published root from your server’s `/root` endpoint so that `AuditLogViewer` can verify the logs’ `membership_proof`.
- **UI Change**:
  - The leftmost column displays verification results instead of the normal expand/collapse arrow.
- **Other Callbacks**:
  - `onSearch`, `onPageChange` for retrieving log data and pagination.
  - `onDownload` for exporting logs if desired.

This example is crucial if you want to ensure tamper-proof integrity in your logs and display verification statuses directly in the UI.

---

## Environment Variables

Most examples can be configured to use **real** data from an Audit Log service if you supply:

- `STORYBOOK_PANGEA_TOKEN`
- `STORYBOOK_SERVICE_DOMAIN`
- `STORYBOOK_CONFIG_ID`
- `STORYBOOK_CLIENT_TOKEN`

When these are unavailable, the stories will generally fall back to mock data or a test server.

---

## Contributing

1. **New Stories**: Add a `.stories.tsx` file in this directory with a clear top-level JSDoc or markdown comment.
2. **Describe Key Props**: In your story, describe any special props or features the story showcases.
3. **Testing**: Run `npm run storybook` or your equivalent command to preview and ensure everything works as expected.
