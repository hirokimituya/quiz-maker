import { GetServerSideProps, NextPage } from "next"
import { getSession } from "next-auth/react"

const Dashboard: NextPage = () => {
  return <></>
}

export default Dashboard

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)

  if (session) {
    return {
      redirect: {
        destination: `/dashboard/${session.user.id}`,
        permanent: false
      }
    }
  } else {
    return {
      notFound: true
    }
  }
}
