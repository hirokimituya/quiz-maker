import { Grid, Typography } from "@mui/material"
import { UserType } from "@pages/index"
import { useRouter } from "next/router"
import AvatarImage from "./AvatarImage"

type UserAvatarProps = {
  user: UserType
}

const UserAvatar = ({ user }: UserAvatarProps) => {
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
      <Grid item onClick={onClickUser}>
        <AvatarImage user={user} />
      </Grid>
      <Grid item onClick={onClickUser}>
        <Typography mt={1} ml={2}>
          {user.name}
        </Typography>
      </Grid>
    </Grid>
  )
}

export default UserAvatar
