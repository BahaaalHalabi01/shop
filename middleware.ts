import { NextResponse } from "next/server";
import { auth } from "./auth";
export default auth((req) => {
  if (!req.auth?.user) {
    return NextResponse.redirect(new URL("/api/auth/signin", req.url));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
