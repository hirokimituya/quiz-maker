import React from "react"
import { AppBar, Box, Toolbar, Typography, Slide, useScrollTrigger, IconButton, useTheme } from "@mui/material"
import Link from "next/link"
import Image from "next/image"
import TextWhiteButton from "./common/TextWhiteButton"
import { ColorModeContext } from "@pages/_app"
import Brightness4Icon from "@mui/icons-material/Brightness4"
import Brightness7Icon from "@mui/icons-material/Brightness7"

type HideOnScrollProps = {
  children: React.ReactElement
}

function HideOnScroll({ children }: HideOnScrollProps) {
  const trigger = useScrollTrigger()
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  )
}

const Header = () => {
  // ダークモード用のコンテキスト値
  const theme = useTheme()
  const colorMode = React.useContext(ColorModeContext)

  return (
    <header>
      <Box sx={{ flexGrow: 1 }}>
        <div id="back-to-top-anchor" />
        <HideOnScroll>
          <AppBar enableColorOnDark>
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <Link href="/">
                  <a>
                    <Image src="/static/logo.png" alt="logo" width="198" height="46" />
                  </a>
                </Link>
              </Typography>
              {/* ダークモード用のアイコン・ボタン */}
              <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode}>
                {theme.palette.mode === "dark" ? (
                  <Brightness7Icon />
                ) : (
                  <Brightness4Icon sx={{ color: "common.white" }} />
                )}
              </IconButton>
              <TextWhiteButton size="large">ユーザー登録</TextWhiteButton>
              <TextWhiteButton size="large">ログイン</TextWhiteButton>
            </Toolbar>
          </AppBar>
        </HideOnScroll>
        <Toolbar />
      </Box>
    </header>
  )
}

export default Header
