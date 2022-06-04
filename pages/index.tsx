import { Grid, Stack, Typography } from "@mui/material"
import { GetServerSideProps, NextPage } from "next"
import Head from "next/head"
import prisma from "@lib/prisma"
import { useRouter } from "next/router"
import QuizInfo, { QuizInfoType, QuizInfoSelect } from "@components/quiz/QuizInfo"
import GenreNav from "@components/genre/GenreNav"
import { Prisma } from "@prisma/client"
import QuizInfoZero from "@components/quiz/QuizInfoZero"

export type GenreType = { id: number; name: string }

export type UserType = {
  id: number
  name: string
  image: string | null
}

type TopPageProps = {
  quizzes: QuizInfoType[]
  quizNumbers: number
  genres: GenreType[]
}

const TopPage: NextPage<TopPageProps> = ({ quizzes, quizNumbers, genres }) => {
  const router = useRouter()
  const { genre } = router.query

  const genreId = genre ? Number(genre) : 0
  const genreName = genres.find((genre) => genre.id === genreId)?.name

  return (
    <>
      <Head>
        <title>ホーム - {process.env.appName}</title>
      </Head>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" component="span">
            ジャンル : &ensp;{genreName ?? "すべて"}
          </Typography>
          <Typography variant="h6" component="span" ml={5}>
            クイズ数 : &ensp;{quizNumbers}
          </Typography>
        </Grid>
        <Grid item xs={12} md={9}>
          <Stack spacing={4}>
            {quizzes.length !== 0 ? (
              quizzes.map((quizInfo: QuizInfoType) => <QuizInfo key={quizInfo.id} quizInfo={quizInfo} />)
            ) : (
              <QuizInfoZero />
            )}
          </Stack>
        </Grid>
        <Grid item xs={12} md>
          <GenreNav genres={genres} genreListId={genreId} />
        </Grid>
      </Grid>
    </>
  )
}

export default TopPage

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { genre } = query

  const genreId = Number(genre) || undefined

  let quizWhere: Prisma.QuizWhereInput | undefined = undefined
  if (!Number.isNaN(genreId)) {
    quizWhere = {
      genreId
    }
  }
  // クイズ一覧の取得
  const quizzes = await prisma.quiz.findMany({
    where: quizWhere,
    select: QuizInfoSelect,
    orderBy: {
      updatedAt: "desc"
    }
  })

  // クイズ数の取得
  const quizNumbers = await prisma.quiz.count({
    where: quizWhere
  })

  // ジャンル一覧を取得
  const genres = await prisma.genre.findMany({
    select: {
      id: true,
      name: true
    }
  })

  return {
    props: {
      quizzes,
      quizNumbers,
      genres
    }
  }
}
