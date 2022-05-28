/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    appName: "QuizMaker",
    quizImageBasePath: "/images/upload/quiz/",
    quizDefaultImage: "/images/upload/quiz/noimage.png",
    userAvatorBasePath: "/images/upload/avator/",
    userDefaultAvator: "/images/upload/avator/noavator.png",
    dateFormat: "yyyy/MM/dd HH:mm:ss"
  }
}

module.exports = nextConfig
