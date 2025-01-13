import {
  CreateMUIWebComponent,
  BrandingThemeProviderProps,
  TransformedProps,
} from ".";

import {
  ShareFileViewer,
  ShareFileViewerProps as SFVP,
} from "@pangeacyber/react-mui-share-file-viewer";

type ShareFileViewerProps = TransformedProps<SFVP>;

export default function registerShareFileViewer({
  props,
  brandingProps,
  name = "share-file-viewer",
  replaceExisting = false,
}: {
  props: ShareFileViewerProps;
  brandingProps?: BrandingThemeProviderProps;
  name: string;
  replaceExisting: boolean;
}) {
  const notOriginallyFunctions: (keyof SFVP)[] = [
    "defaultVisibilityModel",
    "defaultColumnOrder",
    "PangeaDataGridProps",
    "apiRef",
    "configurations",
    "defaultFilter",
    "defaultSort",
    "defaultSortBy",
    "defaultShareLinkTitle",
    "children",
  ];

  const webComponent = CreateMUIWebComponent(
    ShareFileViewer,
    props,
    brandingProps,
    notOriginallyFunctions
  );
  customElements.define(name, webComponent);

  // Replace existing components if deferred
  if (replaceExisting) {
    document.addEventListener("DOMContentLoaded", () => {
      const existingComponents = document.querySelectorAll(name);
      existingComponents.forEach((oldComponent) => {
        const newComponent = document.createElement(name);
        Array.from(oldComponent.attributes).forEach((attr) => {
          newComponent.setAttribute(attr.name, attr.value);
        });
        newComponent.innerHTML = oldComponent.innerHTML;
        oldComponent.replaceWith(newComponent);
      });
    });
  }
}

declare global {
  interface Window {
    registerStoreFileViewer: typeof registerShareFileViewer;
  }
}

if (typeof window !== "undefined") {
  window.registerStoreFileViewer = registerShareFileViewer;
}
