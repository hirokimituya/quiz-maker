import "../styles/globals.css"
import type { AppProps } from "next/app"
import { SessionProvider } from "next-auth/react"
import Head from "next/head"
import { ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { CacheProvider, EmotionCache } from "@emotion/react"
import createEmotionCache from "@src/createEmotionCache"
import Layout from "@components/Layout"
import { createContext, useEffect, useMemo, useRef, useState } from "react"
import { createTheme } from "@mui/material"
import * as yup from "yup"
import { localeJa } from "@src/localeJa"

// ブラウザ内のユーザーのセッション全体で共有される、クライアントサイドのキャッシュ。
const clientSideEmotionCache = createEmotionCache()

// ダークモード用の型とコンテキスト定義
type ModeType = "light" | "dark"
export const ColorModeContext = createContext({ toggleColorMode: () => {} })

// Yupのエラーメッセージを日本語化
yup.setLocale(localeJa)

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}

function MyApp({ Component, pageProps: { session, ...pageProps }, emotionCache = clientSideEmotionCache }: MyAppProps) {
  // ダークモード用の状態管理
  const [mode, setMode] = useState<ModeType>("light")

  // 初回マウント時の判定をするref
  const isDidMount = useRef(true)

  // localStrageにあるダークモード用の値を取得
  useEffect(() => {
    const localStorageMode = localStorage.getItem("mode")
    if (localStorageMode === "light" || localStorageMode === "dark") {
      setMode(localStorageMode)
    }
  }, [])

  // localStrageにダークモードの値を格納
  useEffect(() => {
    // 初回マウント時のフラグがtrueの場合
    if (isDidMount.current) {
      // 初回マウント時のフラグをfalseにして処理は終了させる
      isDidMount.current = false
      return
    }
    localStorage.setItem("mode", mode)
  }, [mode])

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"))
      }
    }),
    []
  )

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: "#64b5f7"
          }
        }
      }),
    [mode]
  )

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>{process.env.appName}</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <SessionProvider session={session}>
            {/* CssBaselineは、エレガントで一貫性のある、シンプルなベースラインを構築するためのキックスタートです。 */}
            <CssBaseline />
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </SessionProvider>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </CacheProvider>
  )
}

export default MyApp
