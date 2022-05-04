import { Button, DialogActions, DialogContent, DialogTitle } from "@material-ui/core"
import MuiDialog  from "@material-ui/core/Dialog"

const Dialog = ({title, open, onClose, onAccept, children}) => {
    return(
        <MuiDialog open={open} fullWidth>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>{children}</DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
                <Button onClick={onAccept}>Accept</Button>
            </DialogActions>
        </MuiDialog>
    )
}

export default Dialog