import { GetServerSideProps, NextPage } from "next"
import { getProviders, getSession, signIn } from "next-auth/react"
import {
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  Divider,
  Button,
  Box
} from "@mui/material"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import React, { useMemo, useState } from "react"
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"
import GitHubIcon from "@mui/icons-material/GitHub"
import GoogleIcon from "@mui/icons-material/Google"
import TextWhiteButton from "@components/common/TextWhiteButton"
import { useRouter } from "next/router"

type SigninProps = {
  providers: any
}

type FormProps = {
  email: string
  password: string
}

const yupSchema = yup.object({
  email: yup.string().required().email(),
  password: yup.string().required()
})

const Signin: NextPage<SigninProps> = ({ providers }) => {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)

  const providersButton: React.ReactNode[] = useMemo(() => {
    // "credentials"を削除
    delete providers["credentials"]
    return Object.values(providers).map((provider: any) => {
      let icon = undefined
      if (provider.id === "github") {
        icon = <GitHubIcon />
      } else if (provider.id === "google") {
        icon = <GoogleIcon />
      }
      return (
        <Button variant="outlined" color="secondary" fullWidth onClick={() => signIn(provider.id)} key={provider.name}>
          {icon}&nbsp;
          {provider.name}でログイン
        </Button>
      )
    })
  }, [providers])

  const {
    control,
    formState: { errors },
    handleSubmit
  } = useForm<FormProps>({
    mode: "onBlur",
    resolver: yupResolver(yupSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  /**
   * フォーム送信したときのイベントハンドラー
   * @param {FormProps} formValues フォームの入力内容
   * @returns {Promise<void>}
   */
  const onSubmitForm = async (formValues: FormProps): Promise<void> => {
    setErrorMessage(undefined)
    const formData = { ...formValues, redirect: false }
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
   * テストユーザーでログインボタンを押下したときのイベントハンドラー
   * @param {React.MouseEvent<HTMLButtonElement>} event イベントオブジェクト
   * @returns {Promise<void>}
   */
  const onClickTestUserButton = async (event: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    event.preventDefault()
    const formData = {
      email: "test@test.co.jp",
      password: "test",
      redirect: false
    }
    const result: any = await signIn("credentials", formData)
    if (result?.status === 200) {
      router.push("/dashboard")
    }
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
                QuizMakerにログイン
              </Typography>
              {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
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
              <TextWhiteButton type="submit" variant="contained" fullWidth>
                ログイン
              </TextWhiteButton>
              <Divider style={{ width: "120%" }} />
              <TextWhiteButton
                type="submit"
                variant="contained"
                color="success"
                fullWidth
                onClick={onClickTestUserButton}
              >
                テストユーザーでログイン
              </TextWhiteButton>
              <Divider style={{ width: "120%" }} />
              {providersButton}
            </Stack>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  )
}

export default Signin

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

  const providers = await getProviders()
  return {
    props: {
      providers
    }
  }
}
