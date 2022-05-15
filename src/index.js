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

const App = () => {
  return (
    <ThemeProvider theme={getTheme()}>
      <CssBaseline enableColorScheme />
      <StyledEngineProvider injectFirst>
        <LoginProvider>
          <Layout>
            <RepoProvider>
              <Router />
            </RepoProvider>
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
