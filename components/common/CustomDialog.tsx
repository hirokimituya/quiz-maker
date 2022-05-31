import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import { Breakpoint } from "@mui/material"

type ComfirmDialogProps = {
  title?: string
  content: string
  open: boolean
  maxWidth?: Breakpoint | false
  onClickOk: () => void
  onClickCancel: () => void
}

const ComfirmDialog = ({
  title = "送信確認ダイアログ",
  content,
  open,
  maxWidth = "sm",
  onClickOk,
  onClickCancel
}: ComfirmDialogProps) => {
  return (
    <Dialog
      open={open}
      maxWidth={maxWidth}
      onClose={onClickCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClickCancel}>キャンセル</Button>
        <Button onClick={onClickOk} autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ComfirmDialog
