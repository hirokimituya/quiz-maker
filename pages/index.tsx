import { Grid } from "@mui/material"
import { NextPage } from "next"
import Head from "next/head"
import prisma from "@lib/prisma"
import { useRouter } from "next/router"

type PageProps = {
  quizzes: {
    id: number
    title: string
    description: string
    createdAt: string
    genere: {
      name: string
    }
    user: {
      id: string
      name: string
      image: string
    }
  }[]
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
      <Grid container>
        <Grid item>ジャンル: {genre ?? "すべて"}</Grid>
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
      }
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
