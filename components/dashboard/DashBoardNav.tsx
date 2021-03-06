import { Box, Paper, Stack, Typography } from "@mui/material"
import { useRouter } from "next/router"
import UserAvatar from "@components/common/UserAvatar"
import { UserType } from "@pages/index"
import TextWhiteButton from "@components/common/TextWhiteButton"
import { useSession } from "next-auth/react"
import { useMemo } from "react"

type DashBoardNavProps = {
  user: UserType
  quizNumbers: number
}

const DashBoardNav = ({ user, quizNumbers }: DashBoardNavProps) => {
  const router = useRouter()
  const { data: session } = useSession()

  const userIdByRouter = router.query.userId
  const userIdBySession = session?.user.id

  const onClickCreateQuizButton = () => {
    router.push("/quiz/create")
  }

  return (
    <Paper sx={{ p: 2, width: "100%" }} elevation={2}>
      <Stack spacing={3}>
        <UserAvatar user={user} />
        {userIdByRouter === userIdBySession && (
          <TextWhiteButton variant="contained" sx={{ mt: 3 }} onClick={onClickCreateQuizButton}>
            クイズ作成
          </TextWhiteButton>
        )}
        <Typography variant="subtitle1" component="div">
          <strong>クイズ作成数:</strong>
          <Box sx={{ ml: 3 }} component="span">
            {quizNumbers}
          </Box>
        </Typography>
      </Stack>
    </Paper>
  )
}

export default DashBoardNav
