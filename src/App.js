import { ThemeProvider } from "@mui/styles";
import "./App.css";
import Layout from "./components/layout";
import { LoginProvider } from "./hooks/login";
import Router from "./router/routes";
import { getTheme } from "./theme";

const App = () => {

  return (
    <ThemeProvider theme={getTheme()}>
      <LoginProvider>
        <Layout>
          <Router/>
        </Layout>
      </LoginProvider>
    </ThemeProvider>
  )
}

export default App;
