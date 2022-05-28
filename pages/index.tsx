import Head from "next/head"

const TopPage = () => {
  return (
    <>
      <Head>
        <title>Home - {process.env.appName}</title>
      </Head>
    </>
  )
}

export default TopPage
