import { Box, Typography } from "@mui/material"
import Head from "next/head"
import Link from "next/link"

const Custome500 = () => {
  return (
    <>
      <Head>
        <title>500 Internal Server Error - {process.env.appName}</title>
      </Head>
      <Box textAlign="center">
        <Typography variant="h4" color="error" mt={6} mb={3}>
          サーバーエラー
        </Typography>
        <Typography>サーバーエラーでアクセスしようとしたページは表示できませんでした。</Typography>
        <Link href="/">
          <a>
            <Typography color="primary" sx={{ ":hover": { textDecoration: "underline", color: "primary.light" } }}>
              トップページに戻る
            </Typography>
          </a>
        </Link>
      </Box>
    </>
  )
}

export default Custome500
