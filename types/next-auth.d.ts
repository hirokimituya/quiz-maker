import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: User
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: User
  }
}

type User = {
  id: string
  emailVertified?: Date
} & DefaultSession["user"]
