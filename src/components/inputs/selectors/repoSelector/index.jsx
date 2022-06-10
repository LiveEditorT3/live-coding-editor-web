import { Lock, LockOpen } from "@mui/icons-material"
import { Grid, Typography } from "@mui/material"
import Dropdown from "../../dropdown"

const RepoSelector = ({ repos, repo, onAdd, onChange }) => {

    return(
        <Dropdown
            size="small"
            fullWidth
            options={repos}
            value={repo || ""}
            getOptionLabel={(option) => (
            <Grid container spacing={1} alignItems="center">
                <Grid item>{option.private ? <Lock /> : <LockOpen />}</Grid>
                <Grid item>
                <Typography variant="body1">
                    <strong>{option?.name}</strong>
                </Typography>
                </Grid>
            </Grid>
            )}
            getOptionValue={(option) => option?.name}
            onChange={onChange}
            onAdd={onAdd}
        />
    )
}
export default RepoSelector