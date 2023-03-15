// middleware.ts
import { NextResponse, userAgent } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { device } = userAgent(request);
  const response = NextResponse.next();
  response.headers.set("loc", JSON.stringify(request.geo));
  response.headers.set("device", JSON.stringify(device));

  return response;
}

// See "Matching Paths" below to learn more
// export const config = {
//   matcher: "/*",
// };
