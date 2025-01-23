import {
  convexAuthNextjsMiddleware,
  isAuthenticatedNextjs,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

export default convexAuthNextjsMiddleware(async (req) => {
  const isAuthenticated = await isAuthenticatedNextjs();
  const url = req.nextUrl.pathname;

  // If user is not authenticated and trying to access protected routes
  if (!isAuthenticated && url !== "/auth") {
    return nextjsMiddlewareRedirect(req, "/auth");
  }

  // If user is authenticated and trying to access auth page
  if (isAuthenticated && url === "/auth") {
    return nextjsMiddlewareRedirect(req, "/");
  }
});

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
