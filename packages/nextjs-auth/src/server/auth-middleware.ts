import { type NextRequest, NextResponse } from "next/server";
import { AuthNClient } from "@pangeacyber/vanilla-js";

type AuthMiddlewareOptions = {
  domain: string;
  token: string;
  redirectUrl?: string;
  publicRoutes?: readonly string[];
  cookieName?: string;
};

function authMiddleware(options: AuthMiddlewareOptions) {
  if (!options.domain) {
    throw new TypeError("Missing required option `domain`.");
  }

  if (!options.token) {
    throw new TypeError("Missing required option `token`.");
  }

  const authn = new AuthNClient({
    clientToken: options.token,
    domain: options.domain,
    callbackUri: options.redirectUrl || "/",
  });

  // The default matches that of @pangeacyber/react-auth.
  const cookieName = options.cookieName || "pangea-token";

  const publicRoutes = options.publicRoutes || [];

  function getSessionToken(request: NextRequest): string | null {
    // Check request header first.
    const authorizationHeader = request.headers.get("authorization");
    const authorizationHeaderParts = authorizationHeader?.split(" ");
    const bearerToken =
      authorizationHeaderParts?.[0]?.toLowerCase() === "bearer" &&
      authorizationHeaderParts?.[1];
    if (bearerToken) {
      return bearerToken;
    }

    // Fallback to cookie.
    const cookie = request.cookies.get(cookieName)?.value;
    if (cookie) {
      return cookie.split(",")[0]!;
    }

    return null;
  }

  function isPublicRoute(request: NextRequest): boolean {
    return publicRoutes.includes(request.nextUrl.pathname);
  }

  return async (request: NextRequest, _response: NextResponse) => {
    // Do nothing on public routes.
    if (isPublicRoute(request)) {
      return NextResponse.next();
    }

    const token = getSessionToken(request);
    console.log(token);
    const valid = token && (await authn.validate(token)).success;
    if (!valid) {
      let redirectUrl = options.redirectUrl && new URL(options.redirectUrl);
      if (!redirectUrl) {
        redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = "/";
      }
      return NextResponse.redirect(redirectUrl);
    }

    // Proceed to next middleware.
    return NextResponse.next();
  };
}

export { authMiddleware };
