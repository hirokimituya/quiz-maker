import TextField from "@mui/material/TextField"
import Autocomplete from "@mui/material/Autocomplete"
import * as React from "react"
import { Controller, useFormContext } from "react-hook-form"

export type objectOption = {
  label: string
  value: string
}

type CustomSelectProps = {
  name: string
  options: Array<string | objectOption>
  label?: string
  variant?: string
  onChange?: (newValue: string | objectOption | null) => void
  disabled?: boolean
}

type Option = {
  label: string
  value: string
  message?: string
}

const CustomSelect = (props: CustomSelectProps, refs: React.Ref<HTMLDivElement>) => {
  const { name, options, label, variant, disabled } = props
  const {
    control,
    formState: { errors }
  } = useFormContext()

  // optionの型判別（文字列配列かobject配列か）
  let isStringArray = options.length > 0 ? (typeof options[0] === "object" ? false : true) : false

  // optionsの再構成
  let arrOptions = isStringArray
    ? Array.from(new Set(options))
    : [
        ...options
          .reduce(
            (itemsMap: any, item: any) => (itemsMap.has(item.label) ? itemsMap : itemsMap.set(item.label, item)),
            new Map()
          )
          .values()
      ]

  // propsのonChange呼び出し
  const handleOnChange = (newValue: any) => {
    props!.onChange && props?.onChange(newValue)
  }

  // valueの変換
  const convertValue = (field: any) => {
    let valueDefault = field.value ?? null
    if (!isStringArray && field.value) {
      valueDefault = arrOptions.find((element) => element.value === field.value)
    }
    return valueDefault
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Autocomplete
          {...field}
          ref={refs}
          options={arrOptions}
          disabled={disabled}
          isOptionEqualToValue={(option, value) => option === value}
          getOptionLabel={(option: objectOption | string) => (typeof option === "object" ? option.label : option ?? "")}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              variant={(variant as any) ?? "standard"}
              error={!!errors[name]}
              helperText={errors[name]?.message}
            />
          )}
          value={convertValue(field)}
          onChange={(_, data: string | Option | null) => {
            const value = data && typeof data === "object" && data.hasOwnProperty("value") ? data.value : data
            field.onChange(value)
            handleOnChange(value)
          }}
        />
      )}
    />
  )
}
export default React.forwardRef(CustomSelect) as (
  p: CustomSelectProps & { ref?: React.Ref<HTMLDivElement> }
) => React.ReactElement
