import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import MuiDialog from "@mui/material/Dialog";

const Dialog = ({ title, open, onClose, onAccept, children, ...rest }) => {
  return (
    <MuiDialog open={open} fullWidth {...rest}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>{children}</DialogContent>
      <DialogActions>
        {onClose && <Button onClick={onClose}>Close</Button>}
        {onAccept && (
          <Button onClick={onAccept} variant="contained">
            Accept
          </Button>
        )}
      </DialogActions>
    </MuiDialog>
  );
};

export default Dialog;
