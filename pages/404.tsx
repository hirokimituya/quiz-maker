import { Box, Typography } from "@mui/material"
import Head from "next/head"
import Link from "next/link"

const Custome404 = () => {
  return (
    <>
      <Head>
        <title>404 Not Found - {process.env.appName}</title>
      </Head>
      <Box textAlign="center">
        <Typography variant="h4" color="error" mt={6} mb={3}>
          ページが見つかりません
        </Typography>
        <Typography>お探しのページは一時的にアクセスできないか、移動または削除された可能性があります。</Typography>
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

export default Custome404
