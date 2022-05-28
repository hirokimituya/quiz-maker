import React from "react"
import { AppBar, Box, Toolbar, Typography, Slide, useScrollTrigger } from "@mui/material"
import Link from "next/link"
import Image from "next/image"
import TextWhiteButton from "./common/TextWhiteButton"

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
  return (
    <header>
      <Box sx={{ flexGrow: 1 }}>
        <div id="back-to-top-anchor" />
        <HideOnScroll>
          <AppBar>
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, cursor: "pointer" }}>
                <Link href="/">
                  <a>
                    <Image src="/static/logo.png" alt="logo" width="198" height="46" />
                  </a>
                </Link>
              </Typography>
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
