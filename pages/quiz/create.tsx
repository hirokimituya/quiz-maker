import {
  Alert,
  Button,
  Grid,
  InputLabel,
  Paper,
  Select,
  TextField,
  Typography,
  FormControl,
  MenuItem,
  SelectChangeEvent
} from "@mui/material"
import { GetServerSideProps, NextPage } from "next"
import { getSession, useSession } from "next-auth/react"
import { Controller, FormProvider, useForm } from "react-hook-form"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import CustomSelect from "@components/common/CustomSelect"
import prisma from "@lib/prisma"
import TextWhiteButton from "@components/common/TextWhiteButton"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import axios, { AxiosResponse } from "axios"
import Axios from "@lib/axios"
import QuizItemForm from "@components/quiz/QuizItemForm"
import CustomDialog from "@components/common/CustomDialog"
import Head from "next/head"

type FormProps = {
  title: string
  description: string
  genreId: number
  items: {
    questionNumber: number
    format: string
    question: string
    answer1?: string
    answer2?: string
    answer3?: string
    choice1?: string
    choice2?: string
    choice3?: string
    choice4?: string
    answerOptionNumber?: number
  }[]
}

type RequestProps = {
  userId: string
  filename?: string
  fileBinary?: string | ArrayBuffer | null
} & FormProps

type QuizCreateProps = {
  genreOptions: {
    value: string
    label: string
  }[]
}

const yupSchema = yup.object({
  title: yup.string().required(),
  description: yup.string().required(),
  genreId: yup.number().required().typeError("この項目は入力必須です"),
  items: yup.array().of(
    yup
      .object()
      .shape({
        questionNumber: yup.number().required(),
        format: yup.string().required().nullable(),
        question: yup.string().required(),
        answer1: yup.string().when("format", {
          is: "1",
          then: yup.string().required(),
          otherwise: yup.string()
        }),
        answer2: yup.string().when("format", {
          is: "2",
          then: yup.string().required("ラジオボタンのチェックは必須です"),
          otherwise: yup.string()
        }),
        answer3: yup.string().when("format", {
          is: "3",
          then: yup.string().required("チェックボックスは少なくとも1つはチェックしてください"),
          otherwise: yup.string()
        }),
        choice1: yup.string(),
        choice2: yup.string(),
        choice3: yup.string(),
        choice4: yup.string(),
        answerOptionNumber: yup.number()
      })
      .required()
  )
})

const QuizCreate: NextPage<QuizCreateProps> = ({ genreOptions }) => {
  const router = useRouter()
  const { data: session } = useSession()

  const [imageFile, setImageFile] = useState<File | undefined>(undefined)
  const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null | undefined>(undefined)
  const [questionsNumber, setQuestionsNumber] = useState<number>(1)
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false)

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
    handleSubmit,
    watch,
    getValues,
    setValue
  } = useFormMethods

  // フォームの値を監視するために使用されます
  const watchFormValues = watch()

  useEffect(() => {
    let items = getValues("items")
    items = items.slice(0, questionsNumber)
    setValue("items", items)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionsNumber])

  /**
   * 送信確認ボタンを押下したときのイベントハンドラー
   * @param {FormProps} formValues フォームの内容
   * @returns
   */
  const onSubmitForm = async (formValues: FormProps) => {
    setErrorMessage(undefined)

    const formData: RequestProps = { ...formValues, userId: session?.user.id as string }

    // TODO: 本番環境のVercelにファイルアップロードがうまくできなかったため、テーブルにデータURL形式で画像データを保存するように修正
    // 画像ファイルアップロード処理
    // if (imageFile) {
    //   const formFileData = new FormData()
    //   formFileData.append("file", imageFile)

    //   const response = await axios.post("/api/quiz/fileupload", formFileData).catch((error) => error.response)

    //   if (response.status === 200) {
    //     formData.filename = response.data.filename
    //   } else {
    //     setErrorMessage("画像ファイルのアップロードが失敗しました。")
    //     console.error("error", response)
    //     return
    //   }
    // }

    formData.fileBinary = imagePreview

    // itemsをDB保存するためのデータ加工
    formData.items = formData.items.map((item: any) => {
      let result: any = {
        questionNumber: item.questionNumber,
        format: Number(item.format),
        question: item.question
      }
      if (item.format === "1") {
        return { ...result, answer: item.answer1 }
      } else {
        for (let i = 1; i <= 4; i++) {
          if (item[`choice${i}`] && item.answerOptionNumber >= i) {
            result = { ...result, [`choice${i}`]: item[`choice${i}`] }
          }
        }
        if (item.format === "2") {
          return { ...result, answer: item.answer2 }
        } else {
          return { ...result, answer: item.answer3 }
        }
      }
    })

    // フォーム内容をDBに保存
    const response: AxiosResponse = await Axios.post("/api/quiz/create", formData).catch((error) => error.response)

    if (response.status !== 200) {
      setErrorMessage("DB更新に失敗しました。")
      console.error("error", response)
      return
    }

    const createdQuiz = response.data

    // クイズ詳細ページに遷移
    router.push(`/quiz/${createdQuiz.id}`)
  }

  /**
   * ファイル入力欄が変更したときのイベントハンドラー
   * @param {React.ChangeEvent<HTMLInputElement>} event ファイルインプットイベントオブジェクト
   * @returns {void}
   */
  const onChangeFileInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setImageFile(event.target.files?.[0])
    setImagePreview(undefined)

    // 何も選択されなかったら処理中断
    if (event.target.files?.length === 0) {
      return
    }

    // ファイル画像でなかったら処理中断
    if (!event.target.files?.[0].type.match("image.*")) {
      return
    }

    // FileReaderクラスのインスタンスを取得
    const reader = new FileReader()

    // ファイルを読み込み終わったタイミングで実行するイベントハンドラー
    reader.onload = (e) => {
      // imagePreviewに読み込み結果（データURL）を代入する
      // imagePreviewに値を入れると<output>に画像が表示される
      setImagePreview(e.target?.result)
    }

    // ファイルを読み込む
    // 読み込まれたファイルはデータURL形式で受け取れる（上記onload参照）
    reader.readAsDataURL(event.target?.files[0])
  }

  /**
   * 確認ダイアログを開く
   * @returns {void}
   */
  const openDialog = (): void => {
    setIsOpenDialog(true)
  }
  /**
   * 確認ダイアログを閉じる
   * @returns {void}
   */
  const closeDialog = (): void => {
    setIsOpenDialog(false)
  }

  return (
    <>
      <Head>
        <title>クイズ作成 - {process.env.appName}</title>
      </Head>
      <Grid container justifyContent="center" alignItems="center" mb={2}>
        <Grid item xs={12} sm={9} md={6}>
          <Typography variant="h3" textAlign="center">
            クイズ作成
          </Typography>
        </Grid>
      </Grid>
      <FormProvider {...useFormMethods}>
        <Paper sx={{ py: 5 }} elevation={2} component="form" onSubmit={handleSubmit(openDialog)}>
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
                    rows={2}
                    multiline
                    fullWidth
                  />
                )}
              />
            </Grid>
            {/* ジャンル入力欄 */}
            <Grid item xs={5}>
              <CustomSelect label="ジャンル" variant="outlined" name="genreId" options={genreOptions} />
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
            {!!imagePreview && (
              <Grid item xs={12}>
                <output>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imagePreview as string} alt="画像プレビュー" style={{ maxWidth: 300 }} />
                </output>
              </Grid>
            )}
            {/* 問題数選択欄 */}
            <Grid item xs={4} mt={3}>
              <FormControl fullWidth>
                <InputLabel id="questions-number-select-label">問題数</InputLabel>
                <Select
                  labelId="questions-number-select-label"
                  id="questions-number-select"
                  value={questionsNumber}
                  label="問題数"
                  size="small"
                  onChange={(event: SelectChangeEvent<number>) => setQuestionsNumber(Number(event.target.value))}
                >
                  {Array.from({ length: 10 }).map((_, index) => (
                    <MenuItem key={index} value={index + 1}>
                      {index + 1}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={8} />
            {/* 問題郡 */}
            {Array.from({ length: questionsNumber }).map((_, index) => (
              <Grid key={index} item xs={12}>
                <QuizItemForm index={index} />
              </Grid>
            ))}
            {/* 送信確認ボタン */}
            <Grid item xs={2} />
            <Grid item xs={8}>
              <TextWhiteButton variant="contained" type="submit" fullWidth>
                <Typography>送信確認</Typography>
              </TextWhiteButton>
            </Grid>
            <Grid item xs={2} />
            {/* ダッシュボードページに戻るボタン */}
            <Grid item xs />
            <Grid item xs={8}>
              <Button variant="outlined" color="secondary" fullWidth onClick={() => router.back()}>
                <Typography>ダッシュボードページに戻る</Typography>
              </Button>
            </Grid>
            <Grid item xs={2} />
          </Grid>
        </Paper>
      </FormProvider>

      <CustomDialog
        content="作成したクイズを送信してもいいですか？"
        maxWidth="md"
        open={isOpenDialog}
        onClickCancel={closeDialog}
        onClickOk={async () => {
          closeDialog()
          await onSubmitForm(watchFormValues)
        }}
      />
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
