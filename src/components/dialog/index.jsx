import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from "@mui/material";
import MuiDialog from "@mui/material/Dialog";

const Dialog = ({ title, open, onClose, onAccept, children, loading, ...rest }) => {
  return (
    <MuiDialog open={open} fullWidth {...rest}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        {
          loading ?
          <Grid container justifyContent="center" sx={{ marginTop: "2vh", marginBottom: "2vh" }}>
            <CircularProgress/>
          </Grid> :
          children
        }
      </DialogContent>
      {
        !loading &&
        <DialogActions>
          {onClose && <Button onClick={onClose}>Close</Button>}
          {onAccept && (
            <Button onClick={onAccept} variant="contained">
              Accept
            </Button>
          )}
        </DialogActions>
      }
    </MuiDialog>
  );
};

export default Dialog;
