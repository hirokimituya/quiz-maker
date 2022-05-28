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

  /*************************************
   * 【genres】作成
   *************************************/
  let genres: Genre[] = []
  for (let i = 1; i < 6; i++) {
    const genre = await prisma.genre.create({
      data: {
        name: `ジャンル${i}`
      }
    })
    genres.push(genre)
  }

  /*************************************
   * 【users】、【quizzes】作成
   *************************************/
  const quizzesNumber = 5

  const quizzesCreate = Array.from({ length: quizzesNumber }).map((_, index) => ({
    genereId: genres[0].id,
    title: `クイズタイトル${index + 1}`,
    description: `クイズ${index + 1}の説明文です。`
  }))

  const user = await prisma.user.create({
    data: {
      name: "アリス",
      email: "Alice@gmail.com",
      password: hasedPassword,
      quizzes: {
        create: quizzesCreate
      }
    },
    include: {
      quizzes: true
    }
  })

  /*************************************
   * 【items】作成
   *************************************/
  const itemsCreate: any = Array.from({ length: quizzesNumber }).map((_, quizIndex) =>
    Array.from({ length: quizIndex + 1 }).map((_, itemIndex) => ({
      quizId: user.quizzes[quizIndex].id,
      questionNumber: itemIndex + 1,
      format: Math.floor(Math.random() * 3) + 1,
      question: `問題${itemIndex + 1}`,
      answer: `回答${itemIndex + 1}`,
      choice1: "選択1",
      choice2: "選択2"
    }))
  )

  for (const itemCreate of itemsCreate) {
    await prisma.item.createMany({
      data: itemCreate
    })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
