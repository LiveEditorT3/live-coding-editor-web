import { makeStyles } from "@material-ui/core/styles";

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