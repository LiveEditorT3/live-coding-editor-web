import "./App.css";
import Layout from "./components/layout";
import { LoginProvider } from "./hooks/login";
import Router from "./router/routes";

const App = () => {

  return (
    <LoginProvider>
      <Layout>
        <Router/>
      </Layout>
    </LoginProvider>
  )
}

export default App;
