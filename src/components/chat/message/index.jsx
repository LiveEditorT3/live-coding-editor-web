import { Card, Grid, Paper, Typography } from "@mui/material"
import useStyles from "./styles"

const Message = ({ user, text, timestamp }) => {
    const classes = useStyles();
    return (
        <Card className={classes.bubble}>
            <Grid container direction="column" sx={{ padding: "4px" }}>
                <Grid item xs={12}>
                    <Typography variant="body2"><strong>{user}</strong></Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="body2" className={classes.text}>{text}</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="caption" textAlign="end">{timestamp}</Typography>
                </Grid>
            </Grid>
        </Card>
    )
}
export default Message