import { Avatar } from "@mui/material"

const AvatarImage = ({ user }: any) => {
  // ユーザーアイコンのパスの作成
  let userAvatarPath = undefined
  if (user.image?.startsWith("http")) {
    userAvatarPath = user.image
  } else if (user.image) {
    userAvatarPath = process.env.userAvatorBasePath + user.image
  }

  return <Avatar alt={user.name} src={userAvatarPath} />
}

export default AvatarImage
