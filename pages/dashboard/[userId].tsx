import { GetServerSideProps, NextPage } from "next"
import prisma from "@lib/prisma"
import { QuizInfoType, QuizInfoSelect } from "@components/quiz/QuizInfo"
import Head from "next/head"
import { Grid, Stack } from "@mui/material"
import QuizInfo from "@components/quiz/QuizInfo"
import QuizInfoZero from "@components/quiz/QuizInfoZero"
import DashBoardNav from "@components/dashboard/DashBoardNav"
import { UserType } from "@pages/index"
import DefaultErrorPage from "next/error"

type DashboardType = {
  userInfo: UserType & { quizzes: QuizInfoType[] }
  quizNumbers: number
}

const Dashboard: NextPage<DashboardType> = ({ userInfo, quizNumbers }) => {
  // propsが取得できなかった場合、404エラーページを出力する
  if (!userInfo) {
    return <DefaultErrorPage statusCode={404} />
  }

  const { quizzes, ...user } = userInfo

  return (
    <>
      <Head>
        <title>ダッシュボード - {process.env.appName}</title>
      </Head>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <DashBoardNav user={user} quizNumbers={quizNumbers} />
        </Grid>
        <Grid item xs={12} md>
          <Stack spacing={4}>
            {quizzes.length !== 0 ? (
              quizzes.map((quizInfo: QuizInfoType) => <QuizInfo key={quizInfo.id} quizInfo={quizInfo} />)
            ) : (
              <QuizInfoZero />
            )}
          </Stack>
        </Grid>
      </Grid>
    </>
  )
}

export default Dashboard

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const userId = query.userId as string

  const userInfo = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      id: true,
      name: true,
      image: true,
      quizzes: {
        select: QuizInfoSelect,
        orderBy: {
          updatedAt: "desc"
        }
      }
    }
  })

  // クイズ数の取得
  const quizNumbers = await prisma.quiz.count({
    where: {
      user: {
        id: userId
      }
    }
  })

  return {
    props: {
      userInfo,
      quizNumbers
    }
  }
}
