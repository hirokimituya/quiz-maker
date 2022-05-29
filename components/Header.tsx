import React, { useState } from "react"
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Slide,
  useScrollTrigger,
  IconButton,
  useTheme,
  Tooltip,
  Avatar,
  Menu,
  MenuItem
} from "@mui/material"
import Link from "next/link"
import Image from "next/image"
import TextWhiteButton from "./common/TextWhiteButton"
import { ColorModeContext } from "@pages/_app"
import Brightness4Icon from "@mui/icons-material/Brightness4"
import Brightness7Icon from "@mui/icons-material/Brightness7"
import { useRouter } from "next/router"
import { signOut, useSession } from "next-auth/react"
import AvatarImage from "@components/common/AvatarImage"
import { UserType } from "@pages"

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
  const router = useRouter()
  const { data: session } = useSession()

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  // ダークモード用のコンテキスト値
  const theme = useTheme()
  const colorMode = React.useContext(ColorModeContext)

  /**
   * ユーザーアイコンを押下したときのイベントハンドラー（メニューを開く）
   * @param event {React.MouseEvent<HTMLButtonElement>} イベントオブジェクト
   * @returns {void}
   */
  const onClickAvatar = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget)
  }

  /**
   * メニューが閉じることを要求したときの処理
   * @returns {void}
   */
  const handleClose = (): void => {
    setAnchorEl(null)
  }

  /**
   * サインインメニューを押下したときのイベントハンドラー
   * @returns {void}
   */
  const onClickSignOut = (): void => {
    handleClose()
    signOut({ callbackUrl: "/auth/signin" })
  }

  /**
   * Dashboardメニューを押下したときのイベントハンドラー
   * @returns {void}
   */
  const onClickDashBoard = (): void => {
    handleClose()
    router.push("/dashboard")
  }

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
              <IconButton sx={{ mr: 2 }} onClick={colorMode.toggleColorMode}>
                {theme.palette.mode === "dark" ? (
                  <Brightness7Icon />
                ) : (
                  <Brightness4Icon sx={{ color: "common.white" }} />
                )}
              </IconButton>
              {!!session ? (
                <>
                  <Tooltip title="メニューを開く">
                    <IconButton onClick={onClickAvatar} sx={{ p: 0, mr: 5 }}>
                      <AvatarImage user={session.user} />
                    </IconButton>
                  </Tooltip>
                  <Menu id="menu-appbar" anchorEl={anchorEl} open={!!anchorEl} onClose={handleClose}>
                    <MenuItem onClick={onClickDashBoard}>
                      <Typography textAlign="center">ダッシュボード</Typography>
                    </MenuItem>
                    <MenuItem onClick={onClickSignOut}>
                      <Typography textAlign="center">サインアウト</Typography>
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <TextWhiteButton size="large">ユーザー登録</TextWhiteButton>
                  <TextWhiteButton size="large" onClick={() => router.push("/auth/signin")}>
                    ログイン
                  </TextWhiteButton>
                </>
              )}
            </Toolbar>
          </AppBar>
        </HideOnScroll>
        <Toolbar />
      </Box>
    </header>
  )
}

export default Header
