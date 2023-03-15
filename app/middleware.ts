// middleware.ts
import { NextResponse, userAgent } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const { device } = userAgent(request);
  nextUrl.searchParams.set("device", JSON.stringify(device));
  nextUrl.searchParams.set("loc", JSON.stringify(request.geo));
  return NextResponse.rewrite(nextUrl);
}

// See "Matching Paths" below to learn more
// export const config = {
//   matcher: "/*",
// };
