import { Avatar, Grid, Typography } from "@mui/material"
import { UserType } from "@pages/index"
import { useRouter } from "next/router"

type UserAvatarProps = {
  user: UserType
}

const UserAvatar = ({ user }: UserAvatarProps) => {
  const router = useRouter()

  let userAvatarPath = undefined
  if (user.image?.startsWith("http")) {
    userAvatarPath = user.image
  } else if (user.image) {
    userAvatarPath = process.env.userAvatorBasePath + user.image
  }

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
        <Avatar alt={user.name} src={userAvatarPath} />
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
