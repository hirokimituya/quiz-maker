import QuizItemAnswer from "@components/quiz/QuizItemAnswer"
import { Button, Grid, Paper, Typography } from "@mui/material"
import { GetServerSideProps, NextPage } from "next"
import Head from "next/head"
import { UserType } from "@pages/index"
import { useRouter } from "next/router"
import QuizInfo from "@components/quiz/QuizInfo"
import prisma from "@lib/prisma"

type QuizAnswerResultTypes = {
  quiz: {
    id: number
    title: string
    description: string
    filename: string | null
    fileBinary?: string
    createdAt: string
    items: {
      id: number
      questionNumber: number
      format: number
      question: string
      answer: string
      choice1: string
      choice2: string
      choice3: string
      choice4: string
    }[]
    genre: {
      name: string
    }
    user: UserType
    _count: {
      items: number
    }
  }
  grade: {
    correctCount: number
    answers: {
      itemId: number
      answer: string
      pass: boolean
    }[]
  }
}

const title = "クイズ回答結果"

const QuizAnswerResult: NextPage<QuizAnswerResultTypes> = ({ quiz, grade }) => {
  const router = useRouter()

  const { items, ...quizInfo } = quiz

  return (
    <>
      <Head>
        <title>
          {title} - {process.env.appName}
        </title>
      </Head>
      <Grid container justifyContent="center" alignItems="center" mb={2}>
        <Grid item xs={12} sm={9} md={6}>
          <Typography variant="h3" textAlign="center">
            {title}
          </Typography>
        </Grid>
      </Grid>
      <Paper sx={{ py: 5 }} elevation={2} component="form">
        <Grid
          container
          direction="row"
          spacing={4}
          sx={(theme) => ({
            px: 2,
            [theme.breakpoints.up("md")]: {
              px: 5
            }
          })}
        >
          {/* クイズ詳細情報 */}
          <Grid item xs={12}>
            <QuizInfo quizInfo={quizInfo} isDetail={true} />
          </Grid>

          {/* クイズ正解数表示 */}
          <Grid item xs={1} />
          <Grid item xs={11}>
            <Typography variant="h4" component="div" color="red">
              {items.length} 問中 {grade.correctCount} 問正解
            </Typography>
          </Grid>

          {/* クイズアイテム解答欄 */}
          {items.map((item) => {
            const answer = grade.answers.find((answer) => answer.itemId === item.id)
            return (
              <Grid key={item.questionNumber} item xs={12}>
                <QuizItemAnswer item={item} answer={answer} />
              </Grid>
            )
          })}

          {/* クイズ詳細ページに戻るボタン */}
          <Grid item xs />
          <Grid item xs={8}>
            <Button variant="outlined" color="secondary" fullWidth onClick={() => router.push(`/quiz/${quiz.id}`)}>
              <Typography>クイズ詳細ページに戻る</Typography>
            </Button>
          </Grid>
          <Grid item xs={2} />
        </Grid>
      </Paper>
    </>
  )
}

export default QuizAnswerResult

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { quizId, gradeId } = query

  const quiz = await prisma.quiz.findUnique({
    where: {
      id: Number(quizId)
    },
    select: {
      id: true,
      title: true,
      description: true,
      filename: true,
      fileBinary: true,
      createdAt: true,
      items: {
        select: {
          id: true,
          questionNumber: true,
          format: true,
          question: true,
          answer: true,
          choice1: true,
          choice2: true,
          choice3: true,
          choice4: true
        },
        orderBy: {
          questionNumber: "asc"
        }
      },
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
    }
  })

  const grade = await prisma.grade.findUnique({
    where: {
      id: Number(gradeId)
    },
    select: {
      correctCount: true,
      answers: {
        select: {
          itemId: true,
          answer: true,
          pass: true
        }
      }
    }
  })

  return {
    props: {
      quiz,
      grade
    },
    notFound: !quiz || !grade
  }
}
