import { Avatar } from "@mui/material"
import { useMemo } from "react"

const AvatarImage = ({ user, isDetail = false }: any) => {
  const size = useMemo(() => (isDetail ? 50 : 40), [isDetail])

  // ユーザーアイコンのパスの作成
  let userAvatarPath = undefined
  if (user.image?.startsWith("http")) {
    userAvatarPath = user.image
  } else if (user.image) {
    userAvatarPath = process.env.userAvatorBasePath + user.image
  }

  return <Avatar alt={user.name} src={userAvatarPath} sx={{ width: size, height: size }} />
}

export default AvatarImage
