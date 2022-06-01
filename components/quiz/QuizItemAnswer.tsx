import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography
} from "@mui/material"
import React, { useEffect, useMemo, useState } from "react"

type QuizItemAnswerProps = {
  item: {
    id: number
    questionNumber: number
    format: number
    question: string
    answer: string
    choice1: string
    choice2: string
    choice3: string
    choice4: string
  }
  onChange: (answer: string | undefined, questionNumber: number) => void
}

const QuizItemAnswer = ({ item, onChange }: QuizItemAnswerProps) => {
  const [answerText, setAnswerText] = useState<string>("")
  const [answerRadio, setAnswerRadio] = useState<string>("1")
  const [answerCheckbox, setAnswerCheckbox] = useState<boolean[]>([false, false, false, false])

  /**
   * 回答のラジオボタンが変更されたときのイベントハンドラー
   * @param {React.ChangeEvent<HTMLInputElement>} event イベントハンドラー
   * @returns {void}
   */
  const onChangeText = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setAnswerText(event.target.value)
  }

  /**
   * 回答のラジオボタンが変更されたときのイベントハンドラー
   * @param {React.ChangeEvent<HTMLInputElement>} event イベントハンドラー
   * @returns {void}
   */
  const onChangeAnswerRadio = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setAnswerRadio(event.target.value)
  }

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
    switch (item.format) {
      case 1:
        value = answerText
        break
      case 2:
        value = answerRadio
        break
      case 3:
        for (let i = 0; i < answerCheckbox.length; i++) {
          if (answerCheckbox[i]) {
            if (!value) {
              value = `${i + 1}`
            } else {
              value += `,${i + 1}`
            }
          }
        }
        break
    }
    onChange(value, item.questionNumber)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answerCheckbox, answerRadio, answerText])

  const answerOptionNumber = useMemo(() => {
    if (item.choice4) return 4
    if (item.choice3) return 3
    return 2
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const answerRender = useMemo(() => {
    switch (item.format) {
      case 1:
        return (
          <TextField
            value={answerText}
            onChange={onChangeText}
            label="回答"
            type="text"
            sx={(theme) => ({
              bgcolor: theme.palette.mode === "light" ? "common.white" : undefined
            })}
            fullWidth
          />
        )
      case 2:
        return (
          <Grid container direction="row" spacing={4}>
            {/* 回答ラジオボタン */}
            <Grid item xs={1} />
            <Grid item xs={11}>
              <Grid container direction="row" spacing={2}>
                <FormControl margin="normal">
                  <FormLabel id="answer-radio">回答</FormLabel>
                  <RadioGroup
                    aria-labelledby="answer-radio"
                    name="answer-radio"
                    value={answerRadio}
                    onChange={onChangeAnswerRadio}
                  >
                    {Array.from({ length: answerOptionNumber }).map((_, i) => (
                      <FormControlLabel
                        key={i}
                        value={i + 1}
                        control={<Radio sx={{ mr: 2 }} />}
                        // @ts-ignore
                        label={item[`choice${i + 1}`]}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
        )
      case 3:
        return (
          <Grid container direction="row" spacing={4}>
            {/* 回答ラジオボタン */}
            <Grid item xs={1} />
            <Grid item xs={11}>
              <Grid container direction="row" spacing={2}>
                <FormControl margin="normal">
                  <FormLabel id="answer-radio">回答</FormLabel>
                  <FormGroup id="answer-radio">
                    {Array.from({ length: answerOptionNumber }).map((_, i) => (
                      <FormControlLabel
                        key={i}
                        control={
                          <Checkbox
                            value={i}
                            checked={answerCheckbox[i]}
                            onChange={onChangeAnswerCheckbox}
                            sx={{ mr: 2 }}
                          />
                        }
                        // @ts-ignore
                        label={item[`choice${i + 1}`]}
                      />
                    ))}
                  </FormGroup>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
        )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answerCheckbox, answerRadio, answerText])

  return (
    <Stack>
      <Typography variant="h6">問題{item.questionNumber}</Typography>
      <Paper
        sx={(theme) => ({
          bgcolor: theme.palette.mode === "light" ? "grey.300" : "grey.800"
        })}
      >
        <Grid container direction="row" spacing={4} py={3} px={2}>
          {/* 問題文欄 */}
          <Grid item xs={12}>
            <Typography variant="h5" component="div">
              {item.question}
            </Typography>
          </Grid>
          {/* 回答 */}
          <Grid item xs={12}>
            {answerRender}
          </Grid>
        </Grid>
      </Paper>
    </Stack>
  )
}

export default QuizItemAnswer
