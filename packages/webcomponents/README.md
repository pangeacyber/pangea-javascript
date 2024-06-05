<p>
  <br />
  <a href="https://pangea.cloud?utm_source=github&utm_medium=webcomponents" target="_blank" rel="noopener noreferrer">
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

This library wraps both the [Audit Log Viewer](../react-mui-audit-log-viewer) and [Store File Viewer](../react-mui-store-file-viewer) react components in [webcomponents](https://www.webcomponents.org/introduction) and renders them using [preact](https://preactjs.com/) so that these components can be used outside of a [react](https://react.dev/) and [mui](https://mui.com/) context.

## Getting Started

This library exposes 2 registration functions (available globally if imported using `<script>`) that allow you to pass props to each component as if you were using the react components.
Each prop declared by the react components is [bound](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind) to the outer webcomponent that
encapsulates them which allows a user to specify different themes, proxy functions, or other configuration options based on how they specify their attributes in their respective `.html` files.

### Install

You can install the package using npm:

```
npm install @pangeacyber/webcomponents
```

or 

You can install this by adding it to an `.html` file. You can copy paste the following in this directory and test using your browser. The following example would have you create an `index.html` file in `pangea-javascript/packages/webcomponents`.

#### HTML

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/icon?family=Material+Icons"
    />
    <script src="dist/browser/audit-log-viewer.js"></script>
    <script>
      registerAuditLogViewer({
        props: {
          onSearch: async function (req) {
            // Show that `this` is bound to web component
            if (this.id !== "1") {
              throw new Error("only one component should be rendered");
            }
            return {
              id: "",
              count: 0,
              events: [],
            };
          },
          onPageChange: async function () {
            return {
              events: [],
              count: 0,
            };
          },
        },
        brandingProps: {
          brandingId: "<your branding id>",
          auth: {
            clientToken: "<your client token>",
            domain: "<your pangea domain>",
          },
        },
      });
    </script>
    <script src="dist/browser/store-file-viewer.js"></script>
    <script>
      registerStoreFileViewer({
        props: {
          apiRef: function () {
            return {
              list: async () => {
                count: 0;
                last: "";
                objects: [];
              },
              get: async () => {},
            };
          },
        },
        brandingProps: {
          brandingId: "<your branding id>",
          auth: {
            clientToken: "<your client token>",
            domain: "<your pangea domain>",
          },
        },
      });
    </script>
  </head>
  <body>
    <audit-log-viewer id="1"></audit-log-viewer>
    <store-file-viewer id="2"></store-file-viewer>
  </body>
</html>
```

If on mac, you can use the following command to test this out (using `index.html` as the file you copied this to):

```
open index.html
```

For further documentation regarding these wrapped components, visit their respective documentation pages:

- [store-file-viewer](../react-mui-store-file-viewer)
- [audit-log-viewer](../react-mui-audit-log-viewer)

Note that each top level non-function prop becomes a function to allow customizability per tag eg.

```tsx
registerAuditLogViewer({
  props: {
    initialQuery: function () {
      return "<some query>";
    },
  },
});
```
