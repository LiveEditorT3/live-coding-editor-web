import React from "react";
import ReactDOM from "react-dom";
import { createTheme } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./stores/store";
import Layout from "./components/layout";
import { LoginProvider } from "./hooks/login";
import Router from "./router/routes";
import {
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
} from "@mui/material";
import RepoProvider from "./contexts/repoContext";
import FluidProvider from "./contexts/fluidContext";
import { useToggleableSemiPersistentState } from "./hooks/useSemiPersistentState";
import FirebaseProvider from "./contexts/firebaseContext";

const App = () => {
  const [themeMode, toggleThemeMode] = useToggleableSemiPersistentState(
    "theme",
    "light",
    ["light", "dark"]
  );

  return (
    <ThemeProvider
      theme={createTheme({
        palette: {
          mode: themeMode,
        },
      })}
    >
      <CssBaseline enableColorScheme />
      <StyledEngineProvider injectFirst>
        <Layout toggleThemeMode={toggleThemeMode}>
          <FluidProvider>
            <RepoProvider>
              <FirebaseProvider>
                <LoginProvider>
                  <Router />
                </LoginProvider>
              </FirebaseProvider>
            </RepoProvider>
          </FluidProvider>
        </Layout>
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
