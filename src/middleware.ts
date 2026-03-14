import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(
              name,
              value,
              options as Parameters<typeof supabaseResponse.cookies.set>[2]
            )
          );
        },
      },
    }
  );

  // Use getSession — reads from cookie, no network call, no token refresh race
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user ?? null;

  const { pathname } = request.nextUrl;

  // Read role from JWT metadata — no DB query needed
  const role = (user?.user_metadata?.role as string) || "doctor";

  // Redirect logged-in users away from public pages
  if (pathname === "/" || pathname === "/login" || pathname === "/signup") {
    if (user) {
      return NextResponse.redirect(
        new URL(role === "patient" ? "/patient/dashboard" : "/dashboard", request.url)
      );
    }
    return supabaseResponse;
  }

  // Require auth for all other routes
  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Patient trying to access doctor routes
  if (
    role === "patient" &&
    (pathname.startsWith("/dashboard") ||
      pathname.startsWith("/patients") ||
      pathname.startsWith("/prescriptions"))
  ) {
    return NextResponse.redirect(new URL("/patient/dashboard", request.url));
  }

  // Doctor trying to access patient routes
  if (role === "doctor" && pathname.startsWith("/patient/")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
