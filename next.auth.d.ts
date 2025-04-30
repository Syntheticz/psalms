import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT, JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      username: string;
      name: string;
      email: string;

      isNewUser: boolean;
    } & DefaultSession;
  }

  interface User extends DefaultUser {
    role: string;
    isNewUser: boolean;
    email: string;
    id: string;
    name: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role: string;
    username: string;
    email: string;
    id: string;
    name: string;
    isNewUser: boolean;
  }
}
