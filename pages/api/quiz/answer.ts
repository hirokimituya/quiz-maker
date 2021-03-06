import { NextApiRequest, NextApiResponse } from "next"
import prisma from "@lib/prisma"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return

  const { quizId, userId, correctCount, answers } = req.body

  try {
    const grade = await prisma.grade.create({
      data: {
        quizId,
        userId,
        correctCount,
        answers: {
          create: answers
        }
      }
    })

    res.status(200).json(grade)
  } catch (error) {
    console.error(error)
    res.status(444).json({ error })
  }
}
