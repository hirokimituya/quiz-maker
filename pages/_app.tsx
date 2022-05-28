import "../styles/globals.css"
import type { AppProps } from "next/app"
import { SessionProvider } from "next-auth/react"
import Head from "next/head"
import { ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { CacheProvider, EmotionCache } from "@emotion/react"
import theme from "@src/theme"
import createEmotionCache from "@src/createEmotionCache"

// ブラウザ内のユーザーのセッション全体で共有される、クライアントサイドのキャッシュ。
const clientSideEmotionCache = createEmotionCache()

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}

function MyApp({ Component, pageProps: { session, ...pageProps }, emotionCache = clientSideEmotionCache }: MyAppProps) {
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <SessionProvider session={session}>
          {/* CssBaselineは、エレガントで一貫性のある、シンプルなベースラインを構築するためのキックスタートです。 */}
          <CssBaseline />
          <Component {...pageProps} />
        </SessionProvider>
      </ThemeProvider>
    </CacheProvider>
  )
}

export default MyApp
