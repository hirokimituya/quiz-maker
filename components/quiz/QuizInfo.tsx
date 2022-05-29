import { ButtonBase, Grid, Paper, Typography } from "@mui/material"
import Image from "next/image"
import { useRouter } from "next/router"
import { format } from "date-fns"
import UserAvatar from "@components/common/UserAvatar"
import { UserType } from "@pages/index"

export type QuizInfoType = {
  id: number
  title: string
  description: string
  filename: string | null
  createdAt: string
  genre: {
    name: string
  }
  user: UserType
  _count: {
    items: number
  }
}

export const QuizInfoSelect = {
  id: true,
  title: true,
  description: true,
  filename: true,
  createdAt: true,
  genre: {
    select: {
      name: true
    }
  },
  user: {
    select: {
      id: true,
      name: true,
      image: true
    }
  },
  _count: {
    select: {
      items: true
    }
  }
} as const

type QuizInfoProps = {
  quizInfo: QuizInfoType
}

const QuizInfo = ({ quizInfo }: QuizInfoProps) => {
  const router = useRouter()
  const user = quizInfo.user
  const quizImagePath = quizInfo.filename
    ? process.env.quizImageBasePath + quizInfo.filename
    : (process.env.quizDefaultImage as string)
  const quizCreatedAt = format(new Date(quizInfo.createdAt), process.env.dateFormat as string)
  const quizInfoTables = [
    { th: "タイトル", td: quizInfo.title },
    { th: "説明", td: quizInfo.description },
    { th: "ジャンル", td: quizInfo.genre.name },
    { th: "設問数", td: `${quizInfo._count.items}問` },
    { th: "作成日", td: quizCreatedAt }
  ]

  /**
   * クイズカードにクリックしたらクイズ詳細ページに遷移する
   * @returns {void}
   */
  const onClickQuizInfo = (): void => {
    router.push(`/quiz/${quizInfo.id}`)
  }

  return (
    <ButtonBase component="div" sx={{ width: "100%" }} onClick={onClickQuizInfo}>
      <Paper sx={{ p: 2, width: "100%" }} elevation={2}>
        <Grid container spacing={2}>
          <UserAvatar user={user} />
          <Grid item>
            <Image alt="quiz image" src={quizImagePath} width={216} height={216} />
          </Grid>
          <Grid item xs={12} sm ml={3}>
            <table>
              <tbody>
                {quizInfoTables.map((quizInfoTable, index) => (
                  <tr key={index}>
                    <th>
                      <Typography variant="subtitle1" textAlign="left" width={80}>
                        {quizInfoTable.th}
                      </Typography>
                    </th>
                    <td>
                      <Typography variant="subtitle1" pl={1}>
                        {quizInfoTable.td}
                      </Typography>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Grid>
        </Grid>
      </Paper>
    </ButtonBase>
  )
}

export default QuizInfo
