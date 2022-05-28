import { Genre, PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
import { saltRounds } from "../constants/constants"
const prisma = new PrismaClient()

async function main() {
  const password = "test"

  const hasedPassword = await bcrypt.hash(password, saltRounds)

  // ユーザーの作成
  await prisma.user.create({
    data: {
      name: "test",
      email: "test@test.co.jp",
      password: hasedPassword
    }
  })

  // ジャンル作成
  let genres: Genre[] = []
  for (let i = 1; i < 6; i++) {
    const genre = await prisma.genre.create({
      data: {
        name: `ジャンル${i}`
      }
    })
    genres.push(genre)
  }

  // クイズ作成
  const quizzesCreate = Array.from({ length: 5 }).map((_, index) => ({
    genereId: genres[0].id,
    title: `クイズタイトル${index + 1}`,
    description: `クイズ${index + 1}の説明文です。`
  }))

  await prisma.user.create({
    data: {
      name: "アリス",
      email: "Alice@gmail.com",
      password: hasedPassword,
      quizzes: {
        create: quizzesCreate
      }
    }
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
