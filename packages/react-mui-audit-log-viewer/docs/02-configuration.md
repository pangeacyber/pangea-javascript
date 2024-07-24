---
title: Install & Configure
displayed_sidebar: react-mui-audit-log-viewer
description: Learn how to configure the Secure Audit Log Viewer components from Pangea in your app
# image: /img/og/open-graph-redact.jpg # TODO
---

# Configuration

Familiarize the process involved to configure the Audit Log Viewer

## Installation

Install Material-UI library.

**npm**

```
npm install @mui/material @emotion/react @emotion/styled @pangeacyber/react-mui-audit-log-viewer
```

**yarn**

```
yarn add @mui/material @emotion/react @emotion/styled @pangeacyber/react-mui-audit-log-viewer
```

### Peer Dependencies

Please note that react and react-dom are peer dependencies too:

```
"peerDependencies": {
  "react": "^17.0.0 || ^18.0.0",
  "react-dom": "^17.0.0 || ^18.0.0"
},
```

To learn more about Material-UI (MUI) check out their [official documentation](https://mui.com/material-ui/getting-started/installation/).

## Customization

Our components use the Material-UI component library, so styling of the component can be controlled through a MUI Theme. See Theming documentation [here](https://mui.com/material-ui/customization/theming/).

Want to apply your Pangea branding to your end application? Check out the `@pangeacyber/react-mui-branding` npm package [here](https://github.com/pangeacyber/pangea-javascript/tree/main/packages/react-mui-branding). The `BrandingThemeProvider` can fetch your Pangea project's branding and apply the styling to a Material-UI Theme.

## Next Steps

- Learn more about the properties and options available to you with the [Secure Audit Log Viewer API Reference Documentation](./api-reference)
- Check out our [Admin Guide](https://pangea.cloud/docs/admin-guide/) if you have a specific task you would like to complete
- If you are feeling confident, you can browse our [APIs](https://pangea.cloud/docs/api/) or explore our [GitHub repo](https://github.com/pangeacyber), which has libraries for supported languages, SDKs, sample apps, etc
- For any questions, you can connect with our [Pangea Discourse for Builders](https://l.pangea.cloud/Jd4wlGs)
