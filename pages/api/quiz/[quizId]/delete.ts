import { NextApiRequest, NextApiResponse } from "next"
import prisma from "@lib/prisma"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") return

  const quizId = Number(req.query.quizId)

  // 必須カラムの存在チェック
  if (isNaN(quizId)) {
    return res.status(544).json({})
  }

  try {
    const quiz = await prisma.quiz.delete({
      where: {
        id: quizId
      }
    })

    res.status(200).json(quiz)
  } catch (error) {
    console.error(error)
    res.status(444).json({ error })
  }
}
