import { useSelector } from "react-redux"

export const clearUser = () => localStorage.removeItem('user')
export const getUserFromStorage = () => JSON.parse(localStorage.getItem('user')) || {}
export const saveUserInStorage = (user) => localStorage.setItem('user', JSON.stringify(user))

const useUser = () => {
    const user = useSelector(store => store.user)

    return {
        user
    }
}
export default useUser