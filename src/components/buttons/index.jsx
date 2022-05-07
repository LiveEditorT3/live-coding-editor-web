import { GitHub } from "@mui/icons-material"
import { Button } from "@mui/material"
import Configuration from "../../config"

const LogIntoGithubButton = () => {
    return (
        <Button 
            href={`https://github.com/login/oauth/authorize?client_id=${Configuration.GH_CLIENT_ID}&redirect_uri=${Configuration.GH_REDIRECT_URL}?path=${Configuration.PATH}&scope=user:email%20repo`} 
            variant='contained' 
            endIcon={<GitHub/>}
        >
            New Session
        </Button> 
    )
}
export default LogIntoGithubButton