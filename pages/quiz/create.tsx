import { Alert, Button, Grid, Paper, TextField, Typography } from "@mui/material"
import { GetServerSideProps, NextPage } from "next"
import { getSession } from "next-auth/react"
import { Controller, FormProvider, useForm } from "react-hook-form"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import CustomSelect from "@components/common/CustomSelect"
import prisma from "@lib/prisma"
import TextWhiteButton from "@components/common/TextWhiteButton"
import { useRouter } from "next/router"
import { useState } from "react"
import axios from "axios"

type FormProps = {
  title: string
  description: string
  genreId: number
  filename?: string
}

type QuizCreateProps = {
  genreOptions: {
    value: string
    label: string
  }[]
}

const yupSchema = yup.object({
  title: yup.string().required(),
  description: yup.string().required(),
  genreId: yup.number().required().typeError("この項目は入力必須です")
})

const QuizCreate: NextPage<QuizCreateProps> = ({ genreOptions }) => {
  const router = useRouter()

  const [imageFile, setImageFile] = useState<File | undefined>(undefined)
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)

  const useFormMethods = useForm<FormProps>({
    mode: "onBlur",
    resolver: yupResolver(yupSchema),
    defaultValues: {
      title: "",
      description: "",
      genreId: undefined
    }
  })

  const {
    control,
    formState: { errors },
    handleSubmit
  } = useFormMethods

  /**
   * 送信確認ボタンを押下したときのイベントハンドラー
   * @param {FormProps} formValues フォームの内容
   * @returns
   */
  const onSubmitForm = async (formValues: FormProps) => {
    setErrorMessage(undefined)

    // 画像ファイルアップロード処理
    if (imageFile) {
      const formData = new FormData()
      formData.append("file", imageFile)

      const response = await axios.post("/api/quiz/fileupload", formData).catch((error) => error.response)

      if (response.status === 200) {
        formValues = { ...formValues, filename: response.data.filename }
      } else {
        setErrorMessage("画像ファイルのアップロードが失敗しました。")
        return
      }
    }

    // フォーム内容をDBに保存
    console.log("formVlaues", formValues)
  }

  /**
   * ファイル入力欄が変更したときのイベントハンドラー
   * @param e {e: React.ChangeEvent<HTMLInputElement>} ファイルインプットイベントオブジェクト
   * @returns {void}
   */
  const onChangeFileInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setImageFile(e.target.files?.[0])
  }

  return (
    <>
      <Grid container justifyContent="center" alignItems="center" mb={2}>
        <Grid item xs={12} sm={9} md={6}>
          <Typography variant="h3" textAlign="center">
            クイズ作成
          </Typography>
        </Grid>
      </Grid>
      <FormProvider {...useFormMethods}>
        <Paper sx={{ py: 5 }} elevation={2} component="form" onSubmit={handleSubmit(onSubmitForm)}>
          <Grid
            container
            direction="row"
            spacing={4}
            sx={(theme) => ({
              px: 2,
              [theme.breakpoints.up("md")]: {
                px: 10
              },
              [theme.breakpoints.up("lg")]: {
                px: 20
              }
            })}
          >
            {/* エラーメッセージ */}
            <Grid item xs={12}>
              {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            </Grid>
            {/* タイトル入力欄 */}
            <Grid item xs={12}>
              <Controller
                control={control}
                name="title"
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="タイトル"
                    type="text"
                    error={!!errors.title}
                    helperText={errors.title?.message}
                    size="small"
                    fullWidth
                  />
                )}
              />
            </Grid>
            {/* 説明入力欄 */}
            <Grid item xs={12}>
              <Controller
                control={control}
                name="description"
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="説明"
                    type="title"
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    size="small"
                    rows={2}
                    multiline
                    fullWidth
                  />
                )}
              />
            </Grid>
            {/* ジャンル入力欄 */}
            <Grid item xs={5}>
              <CustomSelect name="genreId" options={genreOptions} />
            </Grid>
            <Grid item xs={7} />
            {/* 画像アップロード欄 */}
            <Grid item xs={12}>
              <Button variant="contained" component="label" color="success">
                画像ファイルを選択
                <input type="file" accept="image/*" onChange={onChangeFileInput} hidden />
              </Button>
              <Typography component="span" ml={1}>
                {imageFile?.name}
              </Typography>
            </Grid>
            {/* 送信確認ボタン */}
            <Grid item xs={2} />
            <Grid item xs={8}>
              <TextWhiteButton variant="contained" type="submit" fullWidth>
                <Typography>送信確認</Typography>
              </TextWhiteButton>
            </Grid>
            <Grid item xs={2} />
            {/* ダッシュボードページに戻るボタン */}
            <Grid item xs={2} />
            <Grid item xs={8}>
              <Button variant="outlined" color="secondary" fullWidth onClick={() => router.back()}>
                <Typography>ダッシュボードページに戻る</Typography>
              </Button>
            </Grid>
            <Grid item xs={2} />
          </Grid>
        </Paper>
      </FormProvider>
    </>
  )
}

export default QuizCreate

export const getServerSideProps: GetServerSideProps = async (context) => {
  // サインインしていなければサインインページにリダイレクト
  const session = await getSession(context)
  if (!session) {
    return {
      redirect: {
        destination: `/auth/signin`,
        permanent: false
      }
    }
  }

  const genres = await prisma.genre.findMany({
    select: {
      id: true,
      name: true
    }
  })

  const genreOptions = genres.map((genre) => ({
    value: genre.id,
    label: genre.name
  }))

  return {
    props: {
      genreOptions
    }
  }
}
