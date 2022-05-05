import { ExitToApp } from "@mui/icons-material"
import { AppBar, Container, IconButton, Toolbar, Typography } from "@mui/material"
import { signOut } from "../../hooks/login"
import useStyles from './styles'

const Layout = ({ children }) => {
    const classes = useStyles()

    return(
        <div className={classes.root}>
            <AppBar color="primary" position="fixed">
                <Toolbar>
                    <Typography variant="h6" noWrap>Live Coding Editor</Typography>
                    <section className={classes.rightToolbar}>
                        <IconButton onClick={() => signOut()}> 
                            <ExitToApp style={{ color: 'white' }}/>
                        </IconButton>
                    </section>
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