import { auth } from "@/auth";
import { ROLE } from "@prisma/client";

enum USERSTATUS {
  ACTIVE = "ACTIVE",
  PENDING = "PENDING",
  INACTIVE = "INACTIVE",
}

export default auth((req) => {
  const { nextUrl, auth } = req;
  const user = auth?.user;
  const pathname = nextUrl.pathname;
  const role = user?.role as ROLE;
  //   const userStatus = user?.status as USERSTATUS;

  function getNewURL(url: string) {
    return new URL(url, nextUrl.origin);
  }

  if (!req.auth && pathname === "/auth/signup") {
    return;
  }

  if (!req.auth && req.nextUrl.pathname !== "/auth/login") {
    const newUrl = new URL("/auth/login", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }

  if (req.auth && (pathname === "/auth/login" || pathname === "/auth/signup")) {
    if (user?.role === "EMPLOYER") {
      return Response.redirect(getNewURL("/employer/dashboard"));
    } else {
      return Response.redirect(getNewURL("/applicant/dashboard"));
    }
  }

  if (
    user?.isNewUser &&
    pathname !== "/new/applicant" &&
    pathname !== "/new/employer"
  ) {
    if (user.role === "APPLICANT") {
      return Response.redirect(getNewURL("/new/applicant"));
    } else {
      return Response.redirect(getNewURL("/new/employer"));
    }
  }

  if (!user?.isNewUser && pathname.startsWith("/new")) {
    if (user?.role === "EMPLOYER") {
      return Response.redirect(getNewURL("/employer/dashboard"));
    } else {
      return Response.redirect(getNewURL("/applicant/dashboard"));
    }
  }

  if (role === "APPLICANT" && pathname.startsWith("/employer")) {
    return Response.redirect(getNewURL("/forbidden"));
  }

  if (role === "EMPLOYER" && pathname.startsWith("/applicant")) {
    return Response.redirect(getNewURL("/forbidden"));
  }
});

// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// };

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|$).*)"],
};

// export const config = {
//   matcher: ["/tessadsd"],
// };
