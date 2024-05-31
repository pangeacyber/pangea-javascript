import React from "preact/compat";
import { h, render } from "preact";
import {
  BrandingThemeProvider,
  BrandingThemeProviderProps as OriginalBrandingThemeProviderProps,
} from "@pangeacyber/react-mui-branding";
import { ThemeOptions, SimplePaletteColorOptions } from "@mui/material/styles";

import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";

// Used to attach `this` to props going to react
export type TransformedProps<T extends Record<string, any>> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any
    ? (this: HTMLElement, ...args: Parameters<T[K]>) => ReturnType<T[K]>
    : (this: HTMLElement) => T[K];
};

export interface BrandingThemeProviderProps
  extends Omit<OriginalBrandingThemeProviderProps, "children"> {}

export function CreateMUIWebComponent<T>(
  component: React.ComponentType<T>,
  props?: TransformedProps<T>,
  providerProps?: BrandingThemeProviderProps,
  notOriginallyFunctions?: (keyof T)[]
): typeof HTMLElement {
  class MUIWebComponent extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      // TransformedProps assumes all props are functions
      const transformedProps: Partial<T> = {};

      (Object.keys(props) as (keyof T)[]).forEach((key) => {
        if (notOriginallyFunctions && notOriginallyFunctions.includes(key)) {
          const unboundFN = props[key];
          if (!unboundFN) {
            return;
          }
          const fn = unboundFN.bind(this);
          transformedProps[key] = fn();
          return;
        }

        const unboundFN = props[key];
        if (!unboundFN) {
          return;
        }
        const fn = unboundFN.bind(this);
        transformedProps[key] = fn;
      });

      const root = this.attachShadow({ mode: "open" });
      const mountPoint = document.createElement("div");
      root.appendChild(mountPoint);
      const cache = createCache({
        key: typeof component,
        container: mountPoint,
      });

      let themeOverride = (th: ThemeOptions): ThemeOptions => {
        if (!th.palette) {
          return th;
        }
        const components = {
          ...th.components,
          MuiPopover: {
            defaultProps: {
              container: mountPoint,
            },
          },
          MuiPopper: {
            defaultProps: {
              container: mountPoint,
            },
          },
          MuiModal: {
            defaultProps: {
              container: mountPoint,
            },
          },
        };

        const palette = {
          ...th.palette,
          info: {
            contrastText: (th.palette.primary as SimplePaletteColorOptions)
              .contrastText,
            main: (th.palette.primary as SimplePaletteColorOptions).main,
          },
        };
        th.components = components;
        th.palette = palette;
        return th;
      };

      const ReactComponent = component;
      render(
        <CacheProvider value={cache}>
          <BrandingThemeProvider
            {...{
              ...providerProps,
              overrideThemeOptions: themeOverride,
            }}
          >
            <ReactComponent {...transformedProps} />
          </BrandingThemeProvider>
        </CacheProvider>,
        mountPoint
      );
    }
  }
  return MUIWebComponent;
}
