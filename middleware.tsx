import { auth } from "@/auth";

import { NextResponse } from "next/server";

enum USERSTATUS {
  ACTIVE = "ACTIVE",
  PENDING = "PENDING",
  INACTIVE = "INACTIVE",
}

export default auth((req) => {
  const { nextUrl, auth } = req;
  const user = auth?.user;
  //   const userStatus = user?.status as USERSTATUS;

  function getNewURL(url: string) {
    return new URL(url, nextUrl.origin);
  }
  if (!req.auth && req.nextUrl.pathname !== "/login") {
    const newUrl = new URL("/login", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
