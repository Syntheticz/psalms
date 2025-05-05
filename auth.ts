import NextAuth, { User } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

import authConfig from "./auth.config";
// import { Adapter } from "next-auth/adapters";

import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export async function fetchUserRole(id: string) {
  const user = await prisma.user.findFirst({
    where: {
      id: id,
    },
    select: {
      id: true,
      email: true,
      role: true,
      userInfoId: true,
      Company: true,
    },
  });

  if (user) return { user: user };
  return;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  // adapter: PrismaAdapter(prisma) as Adapter,

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, //30 days
    updateAge: 24 * 60 * 60, //24 hours
  },

  providers: [
    CredentialsProvider({
      name: "Log In",
      credentials: {
        email: {
          label: "email",
          type: "text",
          placeholder: "email",
        },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.password) {
          return null;
        }

        try {
          const dbUser = await prisma.user.findFirst({
            where: { email: credentials.email },
          });

          if (dbUser) {
            const passwordMatch = await bcrypt.compare(
              credentials.password as string,
              dbUser.password || ""
            );

            if (!passwordMatch) return null;
            else {
              return {
                role: "",
                id: dbUser.id,
                name: dbUser.name || "",
                email: dbUser.email || "",
                isNewUser: dbUser.userInfoId ? false : true,
              };
            }
          }
          return null;
        } catch (err) {
          if (err instanceof Error) {
            console.log(err);

            throw new Error("There was an error!");
          } else {
            console.log(err);

            throw new Error("There was an error!");
          }
        }
      },
    }),
  ],

  callbacks: {
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth;
    },
    jwt: async ({ token, user, trigger, session }) => {
      if (user) {
        const id = user.id as string;
        const dbUser = await fetchUserRole(id);

        if (dbUser) {
          token.role = dbUser.user.role || "";
          token.id = dbUser.user.id || "";
          (token.email = dbUser.user.email || ""),
            (token.isNewUser =
              dbUser.user.role === "APPLICANT"
                ? dbUser.user.userInfoId
                  ? false
                  : true
                : dbUser.user.Company.length !== 0
                ? false
                : true);
        }

        return token;
      }

      if (trigger === "update") {
        token.isNewUser = session.isNewUser;
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.name = token.name;
        session.user.role = token.role;
        session.user.id = token.id;
        session.user.isNewUser = token.isNewUser;
        session.user.email = token.email;
      }
      return session;
    },
  },
});
