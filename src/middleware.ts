import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const password = process.env.ADMIN_PASSWORD;
  const header = req.headers.get("authorization");
  if (password && header?.startsWith("Basic ")) {
    const decoded = atob(header.slice(6));
    if (decoded.slice(decoded.indexOf(":") + 1) === password) return NextResponse.next();
  }
  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Athar Admin", charset="UTF-8"' },
  });
}

export const config = { matcher: ["/admin/:path*"] };
