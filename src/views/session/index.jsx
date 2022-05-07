import { Grid } from '@mui/material'
import Editor from '../../components/inputs/editor'
import { loggedIn } from '../../hooks/login'
import AdminPanel from '../adminPanel'

const Session = () => {
    return(
        <Grid container spacing={1} direction='column'>
            {
                loggedIn() &&
                <Grid item xs={12}>
                    <AdminPanel/>
                </Grid>
            }
            <Grid item xs={12}>
                <Editor/>
            </Grid>
        </Grid>
)
}

export default Session
