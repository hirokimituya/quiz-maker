import { Grid, Paper, Typography } from "@mui/material"
import { GetServerSideProps, NextPage } from "next"
import { useSession } from "next-auth/react"
import prisma from "@lib/prisma"
import TextWhiteButton from "@components/common/TextWhiteButton"
import { useRouter } from "next/router"
import React, { useState } from "react"
import QuizInfo, { QuizInfoSelect, QuizInfoType } from "@components/quiz/QuizInfo"
import Head from "next/head"
import CustomDialog from "@components/common/CustomDialog"
import Axios from "@lib/axios"

type QuizCreateProps = {
  quiz: QuizInfoType
}

const QuizDetail: NextPage<QuizCreateProps> = ({ quiz }) => {
  const router = useRouter()
  const { data: session } = useSession()

  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false)

  const isOwner = quiz.user.id === session?.user.id

  /**
   * クイズ回答ボタンを押下したときのイベントハンドラー
   * @returns {void}
   */
  const onClickAnswerStart = (): void => {
    router.push(`/quiz/${quiz.id}/answer`)
  }

  /**
   * クイズ編集ボタンを押下したときのイベントハンドラー
   * @returns {void}
   */
  const onClickQuizEdit = (): void => {
    router.push(`/quiz/${quiz.id}/edit`)
  }

  /**
   * クイズ削除ボタンを押下したときのイベントハンドラー
   * @returns {Promise<void>}
   */
  const onClickDelete = async (): Promise<void> => {
    await Axios.delete(`/api/quiz/${quiz.id}/delete`).catch((error) => error.response)
    router.push(`/dashboard/${session?.user.id}`)
  }

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

          {/* クイズ編集・削除ボタン */}
          {isOwner && (
            <>
              <Grid item xs={6} />
              <Grid item xs={3}>
                <TextWhiteButton color="success" variant="contained" fullWidth size="large" onClick={onClickQuizEdit}>
                  <Typography>クイズ編集</Typography>
                </TextWhiteButton>
              </Grid>
              <Grid item xs={3}>
                <TextWhiteButton color="error" variant="contained" fullWidth size="large" onClick={openDialog}>
                  <Typography>クイズ削除</Typography>
                </TextWhiteButton>
              </Grid>
            </>
          )}
        </Grid>
      </Paper>

      <CustomDialog
        content="クイズを削除してもよろしいですか？"
        maxWidth="md"
        open={isOpenDialog}
        onClickCancel={closeDialog}
        onClickOk={async () => {
          closeDialog()
          await onClickDelete()
        }}
      />
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
    },
    notFound: !quiz
  }
}
