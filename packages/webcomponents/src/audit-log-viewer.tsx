import {
  CreateMUIWebComponent,
  BrandingThemeProviderProps,
  TransformedProps,
} from ".";

import {
  AuditLogViewer,
  AuditLogViewerProps as ALVP,
} from "@pangeacyber/react-mui-audit-log-viewer";

type AuditLogViewerProps = TransformedProps<ALVP>;

export default function registerAuditLogViewer({
  props,
  brandingProps,
  name = "audit-log-viewer",
  replaceExisting = false,
}: {
  props: AuditLogViewerProps;
  brandingProps?: BrandingThemeProviderProps;
  name?: string;
  replaceExisting?: boolean;
}) {
  const notOriginallyFunctions: (keyof ALVP)[] = [
    "initialQuery",
    "sx",
    "pageSize",
    "dataGridProps",
    "fields",
    "visibilityModel",
    "verificationOptions",
    "filters",
    "config",
    "schema",
  ];
  const webComponent = CreateMUIWebComponent(
    AuditLogViewer,
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
    registerAuditLogViewer: typeof registerAuditLogViewer;
  }
}

console.log(window);
if (typeof window !== "undefined") {
  window.registerAuditLogViewer = registerAuditLogViewer;
}
