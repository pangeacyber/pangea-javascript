"use client";

import type { ComponentProps } from "react";
import { AuthProvider as InnerAuthProvider } from "@pangeacyber/react-auth";

export const AuthProvider = (
  props: ComponentProps<typeof InnerAuthProvider>
) => (
  <InnerAuthProvider
    cookieOptions={{ ...props.cookieOptions, useCookie: true }}
    {...props}
  />
);
