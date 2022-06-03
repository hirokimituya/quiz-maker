import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import bcrypt from "bcrypt"
import prisma from "@lib/prisma"

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "eamil", type: "eamil" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, _req) {
        const user = await prisma.user.findUnique({
          where: {
            email: credentials?.email
          }
        })

        if (user?.password && credentials?.password) {
          // 送信されてきたパスワードとDBから取得したユーザーのパスワードを比較して、等しければtrue
          const result = await bcrypt.compare(credentials?.password, user.password)

          if (result) {
            const { password, ...returnUser } = user
            // ログイン成功 user: callbacksのjwt()のuserパラメータに渡される値
            return returnUser
          }
        }

        // ログイン失敗
        return null
      }
    })
  ],
  secret: process.env.SECRET,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      // パラメータのuserには、以下の値が格納される
      // Credentialsの場合、authorize()の戻り値
      // Credentials以外の場合、DBのUserテーブルに格納されている値
      if (user) {
        token.user = user
      }
      return token
    },
    async session({ session, token }) {
      session.user = token.user
      return session
    }
  },
  pages: {
    signIn: "/auth/signin"
  }
})
