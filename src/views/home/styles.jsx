import { makeStyles } from "@mui/styles";

export default makeStyles(theme => ({
    paper: {
        padding: theme.spacing(2),
    },
    inputField: {
        "& textarea": {
          fontFamily: "monospace"
        }
      }
}))