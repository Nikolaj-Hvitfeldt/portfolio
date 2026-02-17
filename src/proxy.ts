import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for:
  // - API routes
  // - Next.js internals
  // - Vercel internals
  // - static files (contain a dot)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};

