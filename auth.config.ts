import { PrismaAdapter } from "@auth/prisma-adapter";
import type { NextAuthConfig } from "next-auth";

export default {
  pages: {
    signIn: "/",
  },
  providers: [],
} satisfies NextAuthConfig;
