import type { NextApiRequest, NextApiResponse } from "next"
import prisma from "@lib/prisma"
import { Prisma } from "@prisma/client"
import bcrypt from "bcrypt"
import { saltRounds } from "@constants/constants"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return

  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(544)
  }

  const hasedPassword = await bcrypt.hash(password, saltRounds)

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hasedPassword
      },
      select: {
        id: true,
        name: true,
        image: true
      }
    })

    res.status(200).json(user)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        res.status(444).json({ error_code: error.code, message: error.message })
      }
    }
  }
}
