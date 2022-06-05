import TextWhiteButton from "@components/common/TextWhiteButton"
import QuizItemAnswer from "@components/quiz/QuizItemAnswer"
import { Alert, Button, Grid, Paper, Typography } from "@mui/material"
import { GetServerSideProps, NextPage } from "next"
import Head from "next/head"
import { UserType } from "@pages/index"
import { useState } from "react"
import CustomDialog from "@components/common/CustomDialog"
import { useRouter } from "next/router"
import QuizInfo from "@components/quiz/QuizInfo"
import { useSession } from "next-auth/react"
import { AxiosResponse } from "axios"
import Axios from "@lib/axios"
import prisma from "@lib/prisma"

type QuizAnswerTypes = {
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
}

const QuizAnswer: NextPage<QuizAnswerTypes> = ({ quiz }) => {
  const router = useRouter()
  const { data: session } = useSession()

  const [answers, setAnswers] = useState<(string | undefined)[]>(Array.from({ length: quiz?.items?.length }))
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false)

  /**
   * 確認ダイアログを開く
   * @returns {void}
   */
  const openDialog = (): void => {
    setIsOpenDialog(true)
  }
  /**
   * 確認ダイアログを閉じる
   * @returns {void}
   */
  const closeDialog = (): void => {
    setIsOpenDialog(false)
  }

  /**
   * クイズアイテムの回答が変更されたときに呼ばれるイベントハンドラー
   * @param {string | number} answer 入力された回答
   * @param {number} questionNumber クイズアイテム番号
   * @returns {void}
   */
  const onChangeAnswer = (answer: string | undefined, questionNumber: number): void => {
    setAnswers((oldValue) => {
      const newValue = [...oldValue]
      newValue[questionNumber - 1] = answer
      return newValue
    })
  }

  /**
   * 回答送信ボタンを押下したときに呼ばれるイベントハンドラー
   * @returns {Promise<void>}
   */
  const onSubmitForm = async (): Promise<void> => {
    setErrorMessage(undefined)

    // 送信データ作成 & 正解確認
    let formData: any = {
      quizId: quiz.id,
      userId: session?.user?.id,
      correctCount: 0,
      answers: []
    }

    formData.answers = items.map((item, i) => {
      let pass = false
      if (item.answer && item.answer?.trim() === answers[i]?.trim()) {
        formData.correctCount++
        pass = true
      }
      return {
        itemId: item.id,
        answer: answers[i] ?? "",
        pass
      }
    })

    // フォーム内容をDBに保存
    const response: AxiosResponse = await Axios.post("/api/quiz/answer", formData).catch((error) => error.response)

    if (response.status !== 200) {
      setErrorMessage("DB更新に失敗しました。")
      return
    }

    const createGrade = response.data

    // クイズ詳細ページに遷移
    router.push(`/quiz/${quiz.id}/grade/${createGrade.id}`)
  }

  const { items, ...quizInfo } = quiz

  return (
    <>
      <Head>
        <title>クイズ回答 - {process.env.appName}</title>
      </Head>
      <Grid container justifyContent="center" alignItems="center" mb={2}>
        <Grid item xs={12} sm={9} md={6}>
          <Typography variant="h3" textAlign="center">
            クイズ回答
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
          {/* エラーメッセージ */}
          <Grid item xs={12}>
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          </Grid>

          {/* クイズ詳細情報 */}
          <Grid item xs={12}>
            <QuizInfo quizInfo={quizInfo} isDetail={true} />
          </Grid>

          {/* クイズアイテム解答欄 */}
          {items.map((item) => (
            <Grid key={item.questionNumber} item xs={12}>
              <QuizItemAnswer item={item} onChange={onChangeAnswer} />
            </Grid>
          ))}

          {/* 送信確認ボタン */}
          <Grid item xs={2} />
          <Grid item xs={8}>
            <TextWhiteButton variant="contained" fullWidth onClick={openDialog}>
              <Typography>送信確認</Typography>
            </TextWhiteButton>
          </Grid>
          <Grid item xs={2} />
          {/* ダッシュボードページに戻るボタン */}
          <Grid item xs />
          <Grid item xs={8}>
            <Button variant="outlined" color="secondary" fullWidth onClick={() => router.back()}>
              <Typography>クイズ詳細ページに戻る</Typography>
            </Button>
          </Grid>
          <Grid item xs={2} />
        </Grid>
      </Paper>

      <CustomDialog
        content="回答したクイズを送信してもいいですか？"
        maxWidth="md"
        open={isOpenDialog}
        onClickCancel={closeDialog}
        onClickOk={async () => {
          closeDialog()
          await onSubmitForm()
        }}
      />
    </>
  )
}

export default QuizAnswer

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const quizId = Number(query.quizId)

  if (isNaN(quizId)) {
    return {
      notFound: true
    }
  }

  const quiz = await prisma.quiz.findUnique({
    where: {
      id: quizId
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

  return {
    props: {
      quiz
    },
    notFound: !quiz
  }
}
