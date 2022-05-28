import { PrismaClient } from "@prisma/client"
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
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
