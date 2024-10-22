import {
  CreateMUIWebComponent,
  BrandingThemeProviderProps,
  TransformedProps,
} from ".";

import {
  StoreFileViewer,
  StoreFileViewerProps as SFVP,
} from "@pangeacyber/react-mui-store-file-viewer";

type StoreFileViewerProps = TransformedProps<SFVP>;

export default function registerStoreFileViewer({
  props,
  brandingProps,
  name = "store-file-viewer",
  replaceExisting = false,
}: {
  props: StoreFileViewerProps;
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
    StoreFileViewer,
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
    registerStoreFileViewer: typeof registerStoreFileViewer;
  }
}

if (typeof window !== "undefined") {
  window.registerStoreFileViewer = registerStoreFileViewer;
}
