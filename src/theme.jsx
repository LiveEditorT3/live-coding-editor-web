import { createTheme } from "@mui/material"

export const getTheme = () => 
    createTheme({
        palette :{
            mode: 'dark',
            background: {
                paper: '#282c34'
            }
        }
    })
