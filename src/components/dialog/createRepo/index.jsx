import { Lock, LockOpen } from "@mui/icons-material";
import { Checkbox, Grid, TextField } from "@mui/material";
import { useRepoContext } from "../../../contexts/repoContext";
import Dialog from "../index";

const CreateRepoDialog = ({ open, onClose, onAccept}) => {
    const { name, isPrivate, setRepoName, setRepoPrivate } = useRepoContext();
    return(
        <Dialog
            open={open}
            title="Create Repo"
            onClose={onClose}
            onAccept={onAccept}
        >
            <Grid container spacing={1}>
                <Grid item xs={11}>
                    <TextField
                        label="Name"
                        placeholder="Repository name"
                        fullWidth
                        value={name}
                        onChange={(event) => setRepoName(event.target.value)}
                    />
                </Grid>
                <Grid item xs={1}>
                    <Checkbox
                        checked={isPrivate}
                        icon={<LockOpen/>}
                        checkedIcon={<Lock/>}
                        onChange={(event) => setRepoPrivate(event.target.checked)}
                    />
                </Grid>
            </Grid>
        </Dialog>
    )
}
export default CreateRepoDialog;