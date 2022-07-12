import { AppBar, Container, Toolbar, Typography } from "@mui/material";
import UserMenu from "./userMenu";
import useStyles from "./styles";
import OptionsMenu from "./optionsMenu";
import { LoginContext } from "../../hooks/login/index";
import { useContext } from "react";

const Layout = ({ children, toggleThemeMode }) => {
  const classes = useStyles();
  const { user } = useContext(LoginContext);

  return (
    <div className={classes.root}>
      <AppBar className={classes.appBar} position="fixed">
        <Toolbar>
          <Typography variant="h6" noWrap>
            Live Coding Editor
          </Typography>
          <section className={classes.rightToolbar}>
            <OptionsMenu toggleThemeMode={toggleThemeMode} />
            {(!!user?.name || !!user?.login) && <UserMenu />}
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
