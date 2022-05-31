import { Grid, Typography } from "@mui/material"
import { UserType } from "@pages/index"
import { useRouter } from "next/router"
import AvatarImage from "./AvatarImage"

type UserAvatarProps = {
  user: UserType
  isDetail?: boolean
}

const UserAvatar = ({ user, isDetail = false }: UserAvatarProps) => {
  const router = useRouter()

  /**
   * ユーザーのアイコンと名前をクリックしたらユーザーのダッシュボードページに遷移する
   * @param {React.MouseEvent<HTMLDivElement>} event イベントオブジェクト
   * @returns {void}
   */
  const onClickUser = (event: React.MouseEvent<HTMLDivElement>): void => {
    event.stopPropagation()
    router.push(`/dashboard/${user.id}`)
  }

  return (
    <Grid item container xs={12}>
      <Grid item onClick={onClickUser} sx={{ cursor: "pointer" }}>
        <AvatarImage user={user} isDetail={isDetail} />
      </Grid>
      <Grid item onClick={onClickUser} sx={{ cursor: "pointer" }}>
        <Typography mt={1} ml={2} variant={isDetail ? "h6" : "subtitle1"}>
          {user.name}
        </Typography>
      </Grid>
    </Grid>
  )
}

export default UserAvatar
