import { createTheme } from "@mui/material"
import createPalette from "@mui/material/styles/createPalette"

export const getTheme = () => {
    const palette = createPalette({
        primary: {
            main: '#fc4482',
            contrastText: '#FAFAFA'
        },
        secondary: {
            main: '#FAFAFA',
            contrastText: '#fc4482'
        },
    })

    return createTheme({
        palette
    })
}