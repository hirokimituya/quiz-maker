import CustomSelect from "@components/common/CustomSelect"
import {
  Checkbox,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography
} from "@mui/material"
import React, { useEffect, useMemo, useState } from "react"
import { Controller, useFormContext } from "react-hook-form"

type QuizItemFormProps = {
  index: number
}

const answerFormatOptions = [
  { label: "記述式", value: "1" },
  { label: "単一選択", value: "2" },
  { label: "複数選択", value: "3" }
]

const QuizItemForm = ({ index }: QuizItemFormProps) => {
  const {
    control,
    formState: { errors },
    setValue,
    getValues
  } = useFormContext()

  const [format, setFormat] = useState<string | undefined>(undefined)
  const [answerOptionNumber, setAnswerOptionNumber] = useState<number>(2)
  const [answerRadio, setAnswerRadio] = useState<string | undefined>("1")
  const [answerCheckbox, setAnswerCheckbox] = useState<boolean[]>([true, false, false, false])

  const questionNumber = index + 1

  const yupPreName = `items[${index}]`

  useEffect(() => {
    setValue(`${yupPreName}.questionNumber`, questionNumber)

    // 回答形式の初期値が記述式になるように修正
    setValue(`${yupPreName}.format`, "1")
    onChnageFormat()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  /**
   * 回答形式が変更されたときに呼ばれるイベントハンドラー
   * @returns {void}
   */
  const onChnageFormat = (): void => {
    const format: string | null = getValues(`${yupPreName}.format`)
    if (typeof format === "string") {
      setFormat(format)
    } else {
      setFormat(undefined)
    }
  }

  /**
   * 回答のラジオボタンが変更されたときのイベントハンドラー
   * @param {React.ChangeEvent<HTMLInputElement>} event イベントハンドラー
   * @returns {void}
   */
  const onChangeAnswerRadio = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setAnswerRadio(event.target.value)
  }
  useEffect(() => {
    setValue(`${yupPreName}.answer2`, answerRadio)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answerRadio])

  /**
   * 回答のチェックボックスが変更されたときのイベントハンドラー
   * @param event {React.ChangeEvent<HTMLInputElement>} event イベントハンドラー
   * @returns {void}
   */
  const onChangeAnswerCheckbox = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setAnswerCheckbox((oldValue) => {
      const newValue = [...oldValue]
      newValue[Number(event.target.value)] = event.target.checked
      return newValue
    })
  }
  useEffect(() => {
    let value: string | undefined
    for (let i = 0; i < answerCheckbox.length; i++) {
      if (answerCheckbox[i]) {
        if (!value) {
          value = `${i + 1}`
        } else {
          value += `,${i + 1}`
        }
      }
    }
    setValue(`${yupPreName}.answer3`, value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answerCheckbox])

  /**
   * 回答選択肢数を変更したときのイベントハンドラー
   * @param {SelectChangeEvent<number>} event
   * @returns {void}
   */
  const onChangeAnswerOptionsNumber = (event: SelectChangeEvent<number>): void => {
    setAnswerOptionNumber(Number(event.target.value))
    setValue(`${yupPreName}.answerOptionNumber`, Number(event.target.value))
  }
  useEffect(() => {
    setValue(`${yupPreName}.answerOptionNumber`, 2)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const answerRender = useMemo(() => {
    switch (format) {
      case "1":
        return (
          <Controller
            control={control}
            name={`${yupPreName}.answer1`}
            render={({ field }) => (
              <TextField
                {...field}
                label="回答"
                type="text"
                sx={(theme) => ({
                  bgcolor: theme.palette.mode === "light" ? "common.white" : undefined
                })}
                error={!!errors.items?.[index]?.answer1}
                helperText={errors.items?.[index]?.answer1?.message}
                fullWidth
              />
            )}
          />
        )
      case "2":
        return (
          <Grid container direction="row" spacing={4}>
            {/* 回答選択肢数 */}
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel id="answier-options-number-select-label">回答選択肢数</InputLabel>
                <Select
                  labelId="answier-options-number-select-label"
                  id="answier-options-number-select-label"
                  value={answerOptionNumber}
                  label="回答選択肢数"
                  size="small"
                  sx={(theme) => ({
                    bgcolor: theme.palette.mode === "light" ? "common.white" : undefined
                  })}
                  onChange={onChangeAnswerOptionsNumber}
                >
                  {Array.from({ length: 3 }).map((_, i) => (
                    <MenuItem key={i} value={i + 2}>
                      {i + 2}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={8} />

            {/* 回答ラジオボタン */}
            <Grid item xs={1} />
            <Grid item xs={11}>
              <Grid container direction="row" spacing={2}>
                {Array.from({ length: answerOptionNumber }).map((_, i) => (
                  <Grid item key={i} xs={12}>
                    <Grid container direction="row" spacing={2}>
                      <Grid item xs={1}>
                        <Radio
                          checked={answerRadio === String(i + 1)}
                          onChange={onChangeAnswerRadio}
                          value={i + 1}
                          name="radio-buttons"
                          inputProps={{ "aria-label": "A" }}
                        />
                      </Grid>
                      <Grid item xs={10}>
                        <Controller
                          control={control}
                          name={`${yupPreName}.choice${i + 1}`}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              type="text"
                              sx={(theme) => ({
                                bgcolor: theme.palette.mode === "light" ? "common.white" : undefined
                              })}
                              error={!!errors.items?.[index]?.[`choice${i + 1}`]}
                              helperText={errors.items?.[index]?.[`choice${i + 1}`]?.message}
                              size="small"
                              fullWidth
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        )
      case "3":
        return (
          <Grid container direction="row" spacing={4}>
            {/* 回答選択肢数 */}
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel id="answier-options-number-select-label">回答選択肢数</InputLabel>
                <Select
                  labelId="answier-options-number-select-label"
                  id="answier-options-number-select-label"
                  value={answerOptionNumber}
                  label="回答選択肢数"
                  size="small"
                  sx={(theme) => ({
                    bgcolor: theme.palette.mode === "light" ? "common.white" : undefined
                  })}
                  onChange={onChangeAnswerOptionsNumber}
                >
                  {Array.from({ length: 3 }).map((_, i) => (
                    <MenuItem key={i} value={i + 2}>
                      {i + 2}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={8} />

            {/* 回答ラジオボタン */}
            <Grid item xs={1} />
            <Grid item xs={11}>
              <Grid container direction="row" spacing={2}>
                {!!errors.items?.[index]?.answer3 && (
                  <Typography variant="caption" color="red">
                    {errors.items?.[index]?.answer3?.message}
                  </Typography>
                )}
                {Array.from({ length: answerOptionNumber }).map((_, i) => (
                  <Grid item key={i} xs={12}>
                    <Grid container direction="row" spacing={2}>
                      <Grid item xs={1}>
                        <Checkbox
                          checked={answerCheckbox[i]}
                          onChange={onChangeAnswerCheckbox}
                          value={i}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      </Grid>
                      <Grid item xs={10}>
                        <Controller
                          control={control}
                          name={`${yupPreName}.choice${i + 1}`}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              type="text"
                              sx={(theme) => ({
                                bgcolor: theme.palette.mode === "light" ? "common.white" : undefined
                              })}
                              error={!!errors.items?.[index]?.[`choice${i + 1}`]}
                              helperText={errors.items?.[index]?.[`choice${i + 1}`]?.message}
                              size="small"
                              fullWidth
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [format, answerOptionNumber, answerRadio, answerCheckbox, errors])

  return (
    <Stack>
      <Typography variant="h5">問題{questionNumber}</Typography>
      <Paper
        sx={(theme) => ({
          bgcolor: theme.palette.mode === "light" ? "grey.300" : "grey.800"
        })}
      >
        <Grid container direction="row" spacing={4} py={3} px={2}>
          {/* 問題文入力欄 */}
          <Grid item xs={12}>
            <Controller
              control={control}
              name={`${yupPreName}.question`}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="問題文"
                  type="text"
                  multiline
                  rows={2}
                  sx={(theme) => ({
                    bgcolor: theme.palette.mode === "light" ? "common.white" : undefined
                  })}
                  error={!!errors.items?.[index]?.question}
                  helperText={errors.items?.[index]?.question?.message}
                  fullWidth
                />
              )}
            />
          </Grid>
          {/* 回答形式入力欄 */}
          <Grid item xs={9} md={5}>
            <CustomSelect
              label="回答形式"
              variant="outlined"
              name={`${yupPreName}.format`}
              error={!!errors.items?.[index]?.format}
              helperText={errors.items?.[index]?.format?.message}
              options={answerFormatOptions}
              onChange={onChnageFormat}
            />
          </Grid>
          <Grid item xs={3} md={7} />
          {/* 回答 */}
          <Grid item xs={12}>
            {answerRender}
          </Grid>
        </Grid>
      </Paper>
    </Stack>
  )
}

export default QuizItemForm
