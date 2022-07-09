import { Grid, Typography } from "@mui/material";
import useStyles from "./styles";

const Message = ({ user, text, timestamp }) => {
  const classes = useStyles();
  return (
    <Grid container direction="column" sx={{ padding: "4px" }}>
      <Grid item xs={12}>
        <Typography variant="body2">
          <strong>{user}</strong>{" "}
          <Typography variant="caption">
            {new Date(timestamp).toLocaleString("es-AR")}
          </Typography>
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body2" className={classes.text}>
          {text}
        </Typography>
      </Grid>
    </Grid>
  );
};
export default Message;
