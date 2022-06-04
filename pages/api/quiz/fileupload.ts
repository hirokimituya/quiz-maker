import formidable from "formidable"
import fs from "fs"
import path from "path"
import type { NextApiRequest, NextApiResponse } from "next"

// ファイルアップロードをするときはこの設定がないと自動でbodyパースされてうまくファイルが取得できない
export const config = {
  api: {
    bodyParser: false
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return

  const quizImageDir = process.env.QUIZ_IMAGE_DIR

  const form: any = new formidable.IncomingForm()
  form.uploadDir = quizImageDir
  form.parse(req, async (err: any, fields: any, files: any) => {
    if (err) {
      res.status(500).json({
        method: req.method,
        error: err
      })
    }

    const file = files.file

    console.log(process.cwd())
    console.log("quizImageDir", quizImageDir)
    console.log("__filename", __filename)
    console.error("files", files)
    const extension = path.extname(file.originalFilename)

    let oldPath = file.filepath
    let newPath = path.join(quizImageDir as string, file.newFilename + extension)
    fs.rename(oldPath, newPath, (err) => {
      if (err) throw err
    })

    res.status(200).json({ filename: path.basename(newPath) })
  })
}
