import { useEffect, useState } from "react"
import userService from "../../services/userService"

const useUser = () => {
    const [user, setUser] = useState()

    useEffect(() => {
        const getUser = () => {
            userService.GetUser()
                .then(res => setUser(res))
        }
        getUser()
    }, [])

    return {
        user
    }
}
export default useUser