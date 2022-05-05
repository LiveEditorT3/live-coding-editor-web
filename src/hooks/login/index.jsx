import { GitHub } from "@mui/icons-material"
import { Button } from "@mui/material"
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Configuration from "../../config"
import userService from "../../services/userService"
import { setUser } from "../../stores/user.state"
import { clearUser, getUserFromStorage, saveUserInStorage } from "../user/useUser"
import useStyles from "./styles"

export const TOKEN_KEY = 'x-token'

export const signOut = () => {
    clearToken()
    clearUser()
}
export const clearToken = () => {
    localStorage && localStorage.removeItem(TOKEN_KEY)
    window.location.replace(window.location.origin)
}

const getCode = () => {
    const params = new URLSearchParams(window.location.search)
    return params.get('code')
}
export const getTokenInStorage = () =>
    localStorage && localStorage.getItem(TOKEN_KEY)

export const saveTokenInStorage = (token, key = TOKEN_KEY) =>
    localStorage && localStorage.setItem(key, token)

export const LoginProvider = ({ children }) => {
    const [loggedIn, setLoggedIn] = useState(!!getTokenInStorage())
    const { login } = useSelector(store => store.user.login)
    const classes = useStyles()
    const dispatch = useDispatch()

    useEffect(() => {
        const getAccessToken = async () => {
            var gitCode = getCode()
            if (!!gitCode) {
                userService.Login(gitCode)
                    .then(res => {
                        setLoggedIn(!!res.access_token)
                        saveTokenInStorage(res.access_token)
                        window.location.replace(window.location.origin)
                    })
            }
        }

        getAccessToken()
    }, [])

    useEffect(() => {
        const { user: localUser } = getUserFromStorage()

        const getUser = () => {
            userService.GetUser()
                .then(user => {
                    if (!!user) {
                        saveUserInStorage({ user })
                        dispatch(setUser(user))
                    }
                })
        }

        if (loggedIn) {
            if (!!localUser && localUser.login !== login) dispatch(setUser(localUser))
            else if (!login) getUser()
        }
    }, [dispatch, login, loggedIn])

    return(
        <>
            { 
                loggedIn ? 
                children : 
                <div className={classes.root}>
                    <a href={`https://github.com/login/oauth/authorize?client_id=${Configuration.GH_CLIENT_ID}&redirect_uri=${Configuration.GH_REDIRECT_URL}?path=${Configuration.PATH}&scope=user:email%20repo`}>
                        <Button variant='contained' endIcon={<GitHub/>}>LOG IN WITH GITHUB</Button> 
                    </a>
                </div>
            }
        </>
    )
}