import { GetServerSideProps, NextPage } from "next"
import { getSession, signIn } from "next-auth/react"
import { Grid, Paper, Stack, TextField, Typography, InputAdornment, IconButton, Alert, Box } from "@mui/material"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import React, { useState } from "react"
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"
import TextWhiteButton from "@components/common/TextWhiteButton"
import { useRouter } from "next/router"
import Axios from "@lib/axios"

type FormProps = {
  name: string
  email: string
  password: string
  passwordConfirmation?: string
}

const yupSchema = yup.object({
  name: yup.string().required(),
  email: yup.string().required().email(),
  password: yup.string().required().min(8),
  passwordConfirmation: yup.string().oneOf([yup.ref("password"), null], "パスワード欄と一致していません")
})

const SignUp: NextPage = () => {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)

  const {
    control,
    formState: { errors },
    handleSubmit
  } = useForm<FormProps>({
    mode: "onBlur",
    resolver: yupResolver(yupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: ""
    }
  })

  /**
   * フォーム送信したときのイベントハンドラー
   * @param {FormProps} formValues フォームの入力内容
   * @returns {Promise<void>}
   */
  const onSubmitForm = async (formValues: FormProps): Promise<void> => {
    setErrorMessage(undefined)

    delete formValues.passwordConfirmation

    // ユーザーをDBに登録
    const response = await Axios.post("/api/signup", formValues).catch((error) => error.response)

    if (response.status === 444) {
      setErrorMessage("メールアドレスはすでに登録されています。違うメールアドレスを使用して登録してください。")
      return
    }
    if (response.status === 544) {
      setErrorMessage("入力内容が足りません")
      return
    }

    const formData = { email: formValues.email, password: formValues.password }

    // サインイン処理
    const result: any = await signIn("credentials", formData)

    if (result?.status === 401) {
      setErrorMessage("メールアドレスまたはパスワードが間違っています")
    } else if (result?.status === 200) {
      router.push("/dashboard")
    }
  }

  /**
   * パスワード入力欄のパスワード表示アイコンを押下したときのイベントハンドラー
   * @returns {void}
   */
  const onClickShowPassword = (): void => {
    setShowPassword((newValue) => !newValue)
  }

  /**
   * パスワード（確認用）入力欄のパスワード表示アイコンを押下したときのイベントハンドラー
   * @returns {void}
   */
  const onClickShowPasswordConfirmation = (): void => {
    setShowPasswordConfirmation((newValue) => !newValue)
  }

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} sm={9} md={6}>
        <Paper sx={{ p: 3 }} elevation={2}>
          <Box component="form" onSubmit={handleSubmit(onSubmitForm)}>
            <Stack
              spacing={4}
              alignItems="center"
              sx={(theme) => ({
                px: 2,
                [theme.breakpoints.up("md")]: {
                  px: 5
                },
                [theme.breakpoints.up("lg")]: {
                  px: 10
                }
              })}
            >
              <Typography variant="h4" color="primary">
                新規ユーザー登録
              </Typography>
              {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="ユーザー名"
                    type="text"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    size="small"
                    fullWidth
                  />
                )}
              />
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="メールアドレス"
                    type="email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    size="small"
                    fullWidth
                  />
                )}
              />
              <Controller
                control={control}
                name="password"
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="パスワード"
                    type={showPassword ? "text" : "password"}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    size="small"
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton aria-label="toggle password visibility" onClick={onClickShowPassword} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                )}
              />
              <Controller
                control={control}
                name="passwordConfirmation"
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="パスワード（確認用）"
                    type={showPasswordConfirmation ? "text" : "password"}
                    error={!!errors.passwordConfirmation}
                    helperText={errors.passwordConfirmation?.message}
                    size="small"
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onClickShowPasswordConfirmation}
                            edge="end"
                          >
                            {showPasswordConfirmation ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                )}
              />
              <TextWhiteButton type="submit" variant="contained" fullWidth>
                登録
              </TextWhiteButton>
            </Stack>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  )
}

export default SignUp

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)

  if (session) {
    return {
      redirect: {
        destination: `/dashboard`,
        permanent: false
      }
    }
  }
  return {
    props: {}
  }
}
