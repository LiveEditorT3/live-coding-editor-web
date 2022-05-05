import { makeStyles } from "@mui/styles";

export default makeStyles(theme => ({
    root: {
        display: 'flex',
        width: '100%'
    },
    main: {
        flexGrow: 1
    },
    container: {
        padding: theme.spacing(2),
        overflow: 'auto',
        height: 'calc(100vh - 72px)'
    },
    toolbar: {
        ...theme.mixins.toolbar,
        minHeight: '72px'
    },
    rightToolbar: {
        marginLeft: 'auto'
    }
}))