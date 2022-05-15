import { Route, Routes } from "react-router-dom";
import Home from "../views/home";
import Session from "../views/session";

const Router = () => {
  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route exact path="/:sessionId" element={<Session />} />
    </Routes>
  );
};

export default Router;
