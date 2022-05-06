import { Route, Routes } from "react-router-dom"
import Session from "../views/session"

const Router = () => {
    return(
        <Routes>
            <Route exact path="/" element={<Session />} />
        </Routes>
    )
}

export default Router