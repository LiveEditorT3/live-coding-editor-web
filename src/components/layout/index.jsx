import { AppBar, Container, Toolbar, Typography } from "@mui/material";
import UserMenu from "./userMenu";
import useStyles from "./styles";
import OptionsMenu from "./optionsMenu";
import useUser from "../../hooks/user/useUser";

const Layout = ({ children }) => {
  const classes = useStyles();
  const { name, login } = useUser();

  return (
    <div className={classes.root}>
      <AppBar className={classes.appBar} position="fixed">
        <Toolbar>
          <Typography variant="h6" noWrap>
            Live Coding Editor
          </Typography>
          <section className={classes.rightToolbar}>
            <OptionsMenu />
            {(!!name || !!login) && <UserMenu />}
          </section>
        </Toolbar>
      </AppBar>
      <div className={classes.main}>
        <div className={classes.toolbar} />
        <Container maxWidth="false" className={classes.container}>
          {children}
        </Container>
      </div>
    </div>
  );
};

export default Layout;
