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
