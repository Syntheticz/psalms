import { PrismaAdapter } from "@auth/prisma-adapter";
import type { NextAuthConfig } from "next-auth";

export default {
  pages: {
    signIn: "/auth/login",
    newUser: "/new/user",
  },
  providers: [],
} satisfies NextAuthConfig;
