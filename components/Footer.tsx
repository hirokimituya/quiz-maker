import { Box, Fab, Typography, useScrollTrigger, Zoom } from "@mui/material"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"

type ScrollTopProps = {
  children: React.ReactElement
}

function ScrollTop({ children }: ScrollTopProps) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 500
  })

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const anchor = ((event.target as HTMLDivElement).ownerDocument || document).querySelector("#back-to-top-anchor")

    if (anchor) {
      anchor.scrollIntoView({
        behavior: "smooth",
        block: "center"
      })
    }
  }

  return (
    <Zoom in={trigger}>
      <Box onClick={handleClick} role="presentation" sx={{ position: "fixed", bottom: 32, right: 32, zIndex: 1 }}>
        {children}
      </Box>
    </Zoom>
  )
}

const Footer = () => {
  return (
    <footer>
      <ScrollTop>
        <Fab color="primary" size="medium" aria-label="scroll back to top">
          <KeyboardArrowUpIcon sx={{ color: "common.white" }} />
        </Fab>
      </ScrollTop>
      <Box
        sx={{
          bgcolor: "grey.700",
          color: "common.white",
          p: 1,
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%"
        }}
      >
        <Typography align="center">
          {new Date().getFullYear()} — <strong>QuizMaker</strong>
        </Typography>
      </Box>
    </footer>
  )
}

export default Footer
