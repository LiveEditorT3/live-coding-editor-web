import { Grid } from '@mui/material'
import Editor from '../../components/inputs/editor'
import AdminPanel from '../adminPanel'

const Session = () => {
    return(
        <Grid container spacing={1} direction='column'>
            <Grid item xs={12}>
                <AdminPanel/>
            </Grid>
            <Grid item xs={12}>
                <Editor/>
            </Grid>
        </Grid>
)
}

export default Session
