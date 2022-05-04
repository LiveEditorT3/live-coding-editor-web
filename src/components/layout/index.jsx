import { AppBar, Container, Grid, IconButton, Toolbar, Typography } from "@material-ui/core"
import { ExitToApp } from "@material-ui/icons"
import { clearToken } from "../../hooks/login"
import useStyles from './styles'

const Layout = ({ children }) => {
    const classes = useStyles()

    return(
        <div className={classes.root}>
            <AppBar position="fixed">
                <Toolbar>
                    <Grid container justifyContent="space-between">
                        <Typography><strong>Live Editor</strong></Typography>
                        <IconButton onClick={() => clearToken()}> 
                            <ExitToApp style={{ color: 'white' }}/>
                        </IconButton>
                    </Grid>
                </Toolbar>
            </AppBar>
            <div className={classes.main}>
                <div className={classes.toolbar} />
                <Container maxWidth='xl' className={classes.container}>
                    {children}
                </Container>
            </div>
        </div>
    )
}

export default Layout