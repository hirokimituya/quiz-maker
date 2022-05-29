import { Grid, Stack, Typography } from "@mui/material"
import { GetServerSideProps, NextPage } from "next"
import Head from "next/head"
import prisma from "@lib/prisma"
import { useRouter } from "next/router"
import QuizInfo from "@components/quiz/QuizInfo"
import GenreNav from "@components/genre/GenreNav"
import { Prisma } from "@prisma/client"
import QuizInfoZero from "@components/quiz/QuizInfoZero"

export type QuizInfoType = {
  id: number
  title: string
  description: string
  filename: string | null
  createdAt: string
  genre: {
    name: string
  }
  user: {
    id: string
    name: string
    image: string | null
  }
  _count: {
    items: number
  }
}

export type GenreType = { id: number; name: string }

type TopPageProps = {
  quizzes: QuizInfoType[]
  quizNumbers: number
  genres: GenreType[]
}

const TopPage: NextPage<TopPageProps> = ({ quizzes, quizNumbers, genres }) => {
  const router = useRouter()
  const { genre } = router.query

  const genreId = router.query.genre ? Number(router.query.genre) : 0
  const genreName = genres.find((genre) => genre.id === genreId)?.name

  return (
    <>
      <Head>
        <title>Home - {process.env.appName}</title>
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

  const genreId = Number(genre)

  let quizWhere: Prisma.QuizWhereInput | undefined = undefined
  if (!Number.isNaN(genreId)) {
    quizWhere = {
      genreId
    }
  }
  // クイズ一覧の取得
  const quizzes = await prisma.quiz.findMany({
    where: quizWhere,
    select: {
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
    },
    orderBy: {
      id: "asc"
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
