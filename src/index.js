import React from "react";
import ReactDOM from "react-dom";
import { createTheme } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
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
        <FirebaseProvider>
          <LoginProvider>
            <Layout toggleThemeMode={toggleThemeMode}>
              <FluidProvider>
                <RepoProvider>
                  <Router />
                </RepoProvider>
              </FluidProvider>
            </Layout>
          </LoginProvider>
        </FirebaseProvider>
      </StyledEngineProvider>
    </ThemeProvider>
  );
};

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
