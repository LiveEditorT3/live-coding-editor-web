import React, { useEffect, useState } from "react"
import Configuration from "../../config"
import userService from "../../services/userService"
import { Button } from "@material-ui/core"
import { GitHub } from "@material-ui/icons"
import useStyles from "./styles"

export const TOKEN_KEY = 'x-token'

export const signOut = () =>
    clearToken()

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
    const classes = useStyles()

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