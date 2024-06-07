import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define protected routes and exclude /api/uploadthing
const isProtectedRoute = createRouteMatcher([
  // Protect all routes except the ones under /api/uploadthing
  '/((?!api/uploadthing).*)',
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
