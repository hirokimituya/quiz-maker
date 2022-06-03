import { PrismaClient } from "@prisma/client"

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more:
// https://pris.ly/d/help/next-js-best-practices

declare global {
  var prisma: PrismaClient
}

let prisma: PrismaClient

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient()
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient()
  }
  prisma = global.prisma
}

prisma.$use(async (params, next) => {
  const result = await next(params)

  // 取得結果にDate型がある場合、ページコンポーネントにpropsとして渡す際エラーとなるため、Date型 → string に変換するための処理
  return JSON.parse(JSON.stringify(result))
})

export default prisma
