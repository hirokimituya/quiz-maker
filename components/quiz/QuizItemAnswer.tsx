import {
  Box,
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
  onChange?: (answer: string | undefined, questionNumber: number) => void
  answer?: {
    itemId: number
    answer: string
    pass: boolean
  }
}

const QuizItemAnswer = ({ item, onChange = () => {}, answer }: QuizItemAnswerProps) => {
  // クイズ回答結果で使用するかクイズ回答で使用するかの判断のためのフラグ
  const isResult = !!answer

  let answerTextInit = ""
  let answerRadioInit = "1"
  let answerCheckboxInit = [false, false, false, false]

  if (isResult) {
    switch (item.format) {
      case 1:
        answerTextInit = answer.answer
        break
      case 2:
        answerRadioInit = answer.answer
        break
      case 3:
        const answerNumberArray = answer.answer.split(",")
        answerCheckboxInit = Array.from({ length: 4 }).map((_, index) =>
          answerNumberArray.some((answerNumber) => answerNumber === String(index + 1))
        )
        break
    }
  }

  const [answerText, setAnswerText] = useState<string>(answerTextInit)
  const [answerRadio, setAnswerRadio] = useState<string>(answerRadioInit)
  const [answerCheckbox, setAnswerCheckbox] = useState<boolean[]>(answerCheckboxInit)

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
            inputProps={{
              readOnly: isResult
            }}
          />
        )
      case 2:
        return (
          <Grid container direction="row" spacing={4}>
            {/* 回答ラジオボタン */}
            <Grid item xs={1} />
            <Grid item xs={11}>
              <Grid container direction="row" spacing={2}>
                <FormControl margin="normal" disabled={isResult}>
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
                        label={<Typography fontSize={18}>{item[`choice${i + 1}`]}</Typography>}
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
                <FormControl margin="normal" disabled={isResult}>
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
                        label={<Typography fontSize="22px">{item[`choice${i + 1}`]}</Typography>}
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

  const correctText = useMemo(() => {
    if (isResult) {
      switch (item.format) {
        case 1:
          return item.answer
        case 2:
          // @ts-ignore
          return item[`choice${item.answer}`]
        case 3:
          const answerNumberArray = item.answer.split(",")
          return answerNumberArray.reduce((sum, next) => {
            if (sum !== "") sum += ", "
            // @ts-ignore
            return sum + item[`choice${next}`]
          }, "")
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const circleAndCross = useMemo(() => {
    if (isResult) {
      return answer?.pass ? (
        <Box sx={{ position: "absolute", top: "-50px", left: "70px" }}>
          <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="50" stroke="red" fill="rgba(0, 0, 0, 0)" strokeWidth="4" />
          </svg>
        </Box>
      ) : (
        <Box sx={{ position: "absolute", top: "0px", left: "120px" }}>
          <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="-48 -49 100 100" height="100px" width="100px">
            <rect fillOpacity="0" fill="rgb(0,0,0)" height="100" width="100" y="-49" x="-48" />
            <svg version="1.1" y="-250" x="-250" viewBox="-250 -250 500 500" height="500px" width="500px">
              <g transform="rotate(45,0,0)" strokeLinejoin="round" fill="#fff">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="4"
                  strokeOpacity="1"
                  stroke="rgb(255,0,0)"
                  fill="none"
                  d="m0-66.494624v132.9891"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="4"
                  strokeOpacity="1"
                  stroke="rgb(255,0,0)"
                  fill="none"
                  d="m-66.494624 0h132.9891"
                />
              </g>
            </svg>
          </svg>
        </Box>
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Stack>
      <Typography variant="h5">問題{item.questionNumber}</Typography>
      <Paper
        sx={(theme) => ({
          bgcolor: theme.palette.mode === "light" ? "grey.300" : "grey.800"
        })}
      >
        <Grid container direction="row" spacing={4} py={3} px={2}>
          {/* 問題文欄 */}
          <Grid item xs={12}>
            <Typography variant="h6" component="div">
              {item.question}
            </Typography>
          </Grid>
          {/* 回答 */}
          <Grid item xs={12} sx={{ position: "relative" }}>
            {answerRender}
            {/* マルバツ */}
            {circleAndCross}
          </Grid>
          {/* 正解 */}
          {isResult && (
            <Grid item xs={12}>
              <Typography variant="h5" component="div">
                正解： {correctText}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Stack>
  )
}

export default QuizItemAnswer
