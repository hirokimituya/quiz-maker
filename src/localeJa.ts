export const localeJa = {
  mixed: {
    default: "不正な入力です",
    required: "この項目は入力必須です",
    oneOf: "次の値から選択する必要があります: ${values}",
    notOneOf: "次の値以外を選択する必要があります: ${values}"
  },
  string: {
    length: "${length}文字で入力してください",
    min: "${min}文字以上で入力してください",
    max: "${max}文字以下で入力してください",
    matches: '次の形式で入力してください: "${regex}"',
    email: "メールアドレスの形式が正しくありません",
    url: "URLの形式が正しくありません",
    trim: "前後に空白を含めないでください",
    lowercase: "小文字で入力してください",
    uppercase: "大文字で入力してください"
  },
  number: {
    min: "${min}以上の数字を入力してください",
    max: "${max}以下の数字を入力してください",
    lessThan: "${less}より小さい数字を入力してください",
    moreThan: "${more}より大きい数字を入力してください",
    notEqual: "${notEqual}と等しくない数字を入力してください",
    positive: "正の数を入力してください",
    negative: "負の数を入力してください",
    integer: "整数を入力してください"
  },
  date: {
    min: "${min}以降の日付を入力してください",
    max: "${max}以前の日付を入力してください"
  },
  object: {
    noUnknown: "予期せぬパタメーターが含まれています"
  },
  array: {
    min: "${min}個以上選択してください",
    max: "${max}個以下で選択してください"
  }
}
