import { Grid, Paper, Typography } from "@mui/material"
import { GetServerSideProps, NextPage } from "next"
import { useSession } from "next-auth/react"
import prisma from "@lib/prisma"
import TextWhiteButton from "@components/common/TextWhiteButton"
import { useRouter } from "next/router"
import React from "react"
import QuizInfo, { QuizInfoSelect, QuizInfoType } from "@components/quiz/QuizInfo"
import DefaultErrorPage from "next/error"
import Head from "next/head"

type QuizCreateProps = {
  quiz: QuizInfoType
}

const QuizDetail: NextPage<QuizCreateProps> = ({ quiz }) => {
  const router = useRouter()

  /**
   * クイズ回答ボタンを押下したときのイベントハンドラー
   * @returns {void}
   */
  const onClickAnswerStart = (): void => {
    router.push(`/quiz/${quiz.id}/answer`)
  }

  // propsが取得できなかった場合、404エラーページを出力する
  if (!quiz) {
    return <DefaultErrorPage statusCode={404} />
  }

  return (
    <>
      <Head>
        <title>クイズ詳細 - {process.env.appName}</title>
      </Head>
      <Paper sx={{ py: 5 }} elevation={2}>
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
            <QuizInfo quizInfo={quiz} isDetail={true} />
          </Grid>

          {/* クイズ回答ボタン */}
          <Grid item xs={12}>
            <TextWhiteButton variant="contained" fullWidth size="large" onClick={onClickAnswerStart}>
              <Typography>クイズ回答</Typography>
            </TextWhiteButton>
          </Grid>
        </Grid>
      </Paper>
    </>
  )
}

export default QuizDetail

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const quizId = query.quizId

  const quiz = await prisma.quiz.findUnique({
    where: {
      id: Number(quizId)
    },
    select: QuizInfoSelect
  })

  return {
    props: {
      quiz
    }
  }
}
