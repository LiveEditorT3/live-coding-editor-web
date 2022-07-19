import { useState } from "react";
import { Lock, LockOpen } from "@mui/icons-material";
import { Checkbox, Grid, TextField } from "@mui/material";
import Dialog from "../index";

const CreateRepoDialog = ({ open, loading, onClose, onAccept }) => {
  const [newRepoInput, setNewRepoInput] = useState({
    name: "",
    isPrivate: true,
  });
  return (
    <Dialog
      open={open}
      loading={loading}
      title="Create Repo"
      onClose={onClose}
      onAccept={() => onAccept(newRepoInput.name, newRepoInput.isPrivate)}
    >
      <Grid container spacing={1}>
        <Grid item xs={11}>
          <TextField
            label="Name"
            placeholder="Repository name"
            fullWidth
            value={newRepoInput.name}
            onChange={(event) =>
              setNewRepoInput({ ...newRepoInput, name: event.target.value })
            }
          />
        </Grid>
        <Grid item xs={1}>
          <Checkbox
            checked={newRepoInput.isPrivate}
            icon={<LockOpen />}
            checkedIcon={<Lock />}
            onChange={(event) =>
              setNewRepoInput({
                ...newRepoInput,
                isPrivate: event.target.checked,
              })
            }
          />
        </Grid>
      </Grid>
    </Dialog>
  );
};
export default CreateRepoDialog;
