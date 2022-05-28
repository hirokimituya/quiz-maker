import { Divider, List, ListItem, ListItemButton, ListItemText, Paper, Typography } from "@mui/material"
import { GenreType } from "@pages/index"
import { useRouter } from "next/router"

type GenreNavProps = {
  genres: GenreType[]
  genreListId: number
}

const GenreNav = ({ genres, genreListId }: GenreNavProps) => {
  const router = useRouter()

  const genresList = [...genres]
  genresList.unshift({ id: 0, name: "すべて" })

  const onClickGenreItem = (genreId: number) => {
    if (genreId === 0) {
      router.push("/")
    } else {
      router.push(`/?genre=${genreId}`)
    }
  }

  return (
    <Paper>
      <Typography p={2}>ジャンル別</Typography>
      <Divider />
      <List>
        {genresList.map((genre: GenreType) => (
          <ListItem disablePadding key={genre.id}>
            <ListItemButton selected={genre.id === genreListId} onClick={() => onClickGenreItem(genre.id)}>
              <ListItemText primary={genre.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  )
}

export default GenreNav
