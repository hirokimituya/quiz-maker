import { Grid, Stack, Typography } from "@mui/material"
import { NextPage } from "next"
import Head from "next/head"
import prisma from "@lib/prisma"
import { useRouter } from "next/router"
import QuizInfo from "@components/quiz/QuizInfo"

export type QuizInfoType = {
  id: number
  title: string
  description: string
  filename: string | null
  createdAt: string
  genere: {
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

type PageProps = {
  quizzes: QuizInfoType[]
  genres: { id: number; name: string }[]
}

const TopPage: NextPage<PageProps> = ({ quizzes, genres }) => {
  const router = useRouter()
  const { genre } = router.query

  return (
    <>
      <Head>
        <title>Home - {process.env.appName}</title>
      </Head>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6" component="div">
            ジャンル:&ensp;{genre ?? "すべて"}
          </Typography>
        </Grid>
        <Grid item xs={12} md={9}>
          <Stack spacing={4}>
            {quizzes && quizzes.map((quizInfo: QuizInfoType) => <QuizInfo key={quizInfo.id} quizInfo={quizInfo} />)}
          </Stack>
        </Grid>
        <Grid item xs={12} md>
          {/* TODO: ジャンル一覧コンポーネントが入る */}
        </Grid>
      </Grid>
    </>
  )
}

export default TopPage

export async function getServerSideProps() {
  // クイズ一覧の取得
  const quizzes = await prisma.quiz.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      filename: true,
      createdAt: true,
      genere: {
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
      genres
    }
  }
}
