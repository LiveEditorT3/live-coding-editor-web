import { Route, Routes } from "react-router-dom"
import Home from "../views/home"

const Router = () => {
    return(
        <Routes>
            <Route exact path="/" element={<Home />} />
        </Routes>
    )
}

export default Router