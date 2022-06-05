import { NextApiRequest, NextApiResponse } from "next"
import prisma from "@lib/prisma"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") return

  const { id, userId, title, description, genreId, filename, fileBinary, items } = req.body

  // 必須カラムの存在チェック
  if (!id || !userId || !title || !description || !genreId || !items) {
    return res.status(544).json({})
  }

  try {
    // Quiz更新
    const quizUpdate = prisma.quiz.update({
      where: {
        id
      },
      data: {
        userId,
        title,
        description,
        genreId,
        filename,
        fileBinary
      }
    })

    // Item一括削除
    const itemDelete = prisma.item.deleteMany({
      where: {
        quizId: id
      }
    })

    // Item一括追加
    const itemCreate = prisma.item.createMany({
      data: items
    })

    const [quiz, _item1, _item2] = await prisma.$transaction([quizUpdate, itemDelete, itemCreate])

    res.status(200).json(quiz)
  } catch (error) {
    console.error(error)
    res.status(444).json({ error })
  }
}
