import { useContext } from "react";
import { Lock, LockOpen } from "@mui/icons-material";
import { Checkbox, Grid, TextField } from "@mui/material";
import { RepoContext } from "../../../contexts/repoContext";
import Dialog from "../index";

const CreateRepoDialog = ({ open, onClose, onAccept }) => {
  const { repoName, repoIsPrivate, setRepoName, setRepoIsPrivate } =
    useContext(RepoContext);
  return (
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
            value={repoName}
            onChange={(event) => setRepoName(event.target.value)}
          />
        </Grid>
        <Grid item xs={1}>
          <Checkbox
            checked={repoIsPrivate}
            icon={<LockOpen />}
            checkedIcon={<Lock />}
            onChange={(event) => setRepoIsPrivate(event.target.checked)}
          />
        </Grid>
      </Grid>
    </Dialog>
  );
};
export default CreateRepoDialog;
