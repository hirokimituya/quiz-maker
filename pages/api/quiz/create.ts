import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return

  const { userId, title, description, genreId, filename, items } = req.body

  // 必須カラムの存在チェック
  if (!userId || !title || !description || !genreId || !items) {
    return res.status(544).json({})
  }

  try {
    const quiz = await prisma.quiz.create({
      data: {
        userId,
        title,
        description,
        genreId,
        filename,
        items: {
          create: items
        }
      }
    })

    res.status(200).json(quiz)
  } catch (error) {
    console.error(error)
    res.status(444).json({ error })
  }
}
