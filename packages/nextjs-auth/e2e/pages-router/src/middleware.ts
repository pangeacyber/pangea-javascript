import { authMiddleware } from "@pangeacyber/nextjs-auth/server";

export const middleware = authMiddleware({
  domain: process.env.NEXT_PUBLIC_PANGEA_DOMAIN!,
  token: process.env.NEXT_PUBLIC_PANGEA_AUTHN_CLIENT_TOKEN!,
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
