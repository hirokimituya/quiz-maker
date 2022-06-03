import Header from "./Header"
import Footer from "./Footer"
import { Container } from "@mui/material"
import { ReactNode } from "react"

type LayoutProps = {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => (
  <>
    <Header />
    <main>
      <Container sx={{ mt: 3, mb: 8 }}>{children}</Container>
    </main>
    <Footer />
  </>
)

export default Layout
