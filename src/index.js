import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./stores/store";
import Layout from "./components/layout";
import { LoginProvider } from "./hooks/login";
import Router from "./router/routes";
import { getTheme } from "./theme";
import {
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
} from "@mui/material";
import RepoProvider from "./contexts/repoContext";
import FluidProvider from "./contexts/fluidContext";
import useTheme from "./hooks/theme/useLightTheme";
import FirebaseProvider from "./contexts/firebaseContext";

const App = () => {
  const { lightTheme } = useTheme();
  return (
    <ThemeProvider theme={getTheme(lightTheme)}>
      <CssBaseline enableColorScheme />
      <StyledEngineProvider injectFirst>
        <LoginProvider>
          <Layout>
            <FluidProvider>
              <RepoProvider>
                <FirebaseProvider>
                  <Router />
                </FirebaseProvider>
              </RepoProvider>
            </FluidProvider>
          </Layout>
        </LoginProvider>
      </StyledEngineProvider>
    </ThemeProvider>
  );
};

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
