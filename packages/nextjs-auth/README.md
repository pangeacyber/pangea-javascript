# Pangea AuthN + Next.js

## Installation

```bash
npm install @pangeacyber/nextjs-auth
```

## Usage: App Router

Add environment variables to `.env`:

```
NEXT_PUBLIC_PANGEA_DOMAIN="aws.us.pangea.cloud" # or gcp
NEXT_PUBLIC_AUTHN_CLIENT_TOKEN="pcl_[...]"
NEXT_PUBLIC_AUTHN_HOSTED_LOGIN_URL="https://pdn-[...].login.aws.us.pangea.cloud"
```

Wrap the root of the app in an `<AuthProvider>`
(typically in a [`layout.tsx`][nextjs-app-router-layouts]):

```tsx
import { AuthProvider } from "@pangeacyber/nextjs-auth/client";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AuthProvider
      loginUrl={process.env.NEXT_PUBLIC_AUTHN_HOSTED_LOGIN_URL!}
      config={{
        clientToken: process.env.NEXT_PUBLIC_AUTHN_CLIENT_TOKEN!,
        domain: process.env.NEXT_PUBLIC_PANGEA_DOMAIN!,
      }}
    >
      <html lang="en">
        <body>{children}</body>
      </html>
    </AuthProvider>
  );
}
```

Use the `useAuth()` hook to interact with the user's session:

```tsx
"use client";

import { useAuth } from "@pangeacyber/nextjs-auth/client";

export default function Home() {
  const { authenticated, login, logout } = useAuth();

  return (
    <main>
      <p>Authenticated? {authenticated ? "YES" : "NO"}</p>

      {!authenticated && <button onClick={login}>Sign In</button>}
      {authenticated && <button onClick={logout}>Sign Out</button>}
    </main>
  );
}
```

To add server-side authentication, add [middleware][nextjs-app-router-middleware]
to `middleware.ts`:

```ts
import { authMiddleware } from "@pangeacyber/nextjs-auth/server";

export const middleware = authMiddleware({
  domain: process.env.NEXT_PUBLIC_PANGEA_DOMAIN!,
  token: process.env.NEXT_PUBLIC_PANGEA_AUTHN_CLIENT_TOKEN!,

  // List of routes that do not require authentication.
  publicRoutes: ["/"],
});

export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    // - api (API routes)
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
```

## Usage: Pages Router

Add environment variables to `.env`:

```
NEXT_PUBLIC_PANGEA_DOMAIN="aws.us.pangea.cloud" # or gcp
NEXT_PUBLIC_AUTHN_CLIENT_TOKEN="pcl_[...]"
NEXT_PUBLIC_AUTHN_HOSTED_LOGIN_URL="https://pdn-[...].login.aws.us.pangea.cloud"
```

Wrap the root of the app in an `<AuthProvider>`
(typically in a [`_app.tsx`][nextjs-pages-router-custom-app]):

```tsx
import type { AppProps } from "next/app";
import { AuthProvider } from "@pangeacyber/nextjs-auth/client";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider
      loginUrl={process.env.NEXT_PUBLIC_AUTHN_HOSTED_LOGIN_URL!}
      config={{
        clientToken: process.env.NEXT_PUBLIC_AUTHN_CLIENT_TOKEN!,
        domain: process.env.NEXT_PUBLIC_PANGEA_DOMAIN!,
      }}
    >
      <Component {...pageProps} />
    </AuthProvider>
  );
}
```

Use the `useAuth()` hook to interact with the user's session:

```tsx
import { useAuth } from "@pangeacyber/nextjs-auth/client";

export default function Home() {
  const { authenticated, login, logout } = useAuth();

  return (
    <main>
      <p>Authenticated? {authenticated ? "YES" : "NO"}</p>

      {!authenticated && <button onClick={login}>Sign In</button>}
      {authenticated && <button onClick={logout}>Sign Out</button>}
    </main>
  );
}
```

To add server-side authentication, add [middleware][nextjs-pages-router-middleware]
to `middleware.ts`:

```ts
import { authMiddleware } from "@pangeacyber/nextjs-auth/server";

export const middleware = authMiddleware({
  domain: process.env.NEXT_PUBLIC_PANGEA_DOMAIN!,
  token: process.env.NEXT_PUBLIC_PANGEA_AUTHN_CLIENT_TOKEN!,

  // List of routes that do not require authentication.
  publicRoutes: ["/"],
});

export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    // - api (API routes)
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
```

## API

TODO

[nextjs-app-router-layouts]: https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#layouts
[nextjs-app-router-middleware]: https://nextjs.org/docs/app/building-your-application/routing/middleware
[nextjs-pages-router-custom-app]: https://nextjs.org/docs/pages/building-your-application/routing/custom-app
[nextjs-pages-router-middleware]: https://nextjs.org/docs/pages/building-your-application/routing/middleware
