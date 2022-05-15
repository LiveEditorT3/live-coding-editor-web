import { makeStyles } from "@mui/styles";

export default makeStyles((theme) => ({
  root: {
    display: "flex",
    height: "100vh",
  },
  appBar: {
    backgroundColor: "#083168",
  },
  main: {
    flexGrow: 1,
  },
  container: {
    padding: theme.spacing(2),
    overflow: "auto",
    height: "calc(100vh - 72px)",
  },
  toolbar: {
    ...theme.mixins.toolbar,
    minHeight: "72px",
  },
  rightToolbar: {
    marginLeft: "auto",
  },
}));
