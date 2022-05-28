import axios from "axios"

// axios共通設定
const Axios = axios.create({
  responseType: "json",
  headers: {
    "Content-Type": "application/json"
  }
})

export default Axios
