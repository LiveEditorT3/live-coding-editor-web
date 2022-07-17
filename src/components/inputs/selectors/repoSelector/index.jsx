import { useState } from "react";
import CreateRepoDialog from "../../../dialog/createRepo";
import { Lock, LockOpen } from "@mui/icons-material";
import { Grid, Typography } from "@mui/material";
import Dropdown from "../../dropdown";

const RepoSelector = ({ repos, repo, onChange, onAccept }) => {
  const [openCreateRepoDialog, setOpenCreateRepoDialog] = useState(false);

  return (
    <>
      <CreateRepoDialog
        open={openCreateRepoDialog}
        onClose={() => setOpenCreateRepoDialog(false)}
        onAccept={(name, isPrivate) => {
          onAccept(name, isPrivate);
          setOpenCreateRepoDialog(false);
        }}
      />
      <Dropdown
        size="small"
        fullWidth
        options={repos}
        value={repo || ""}
        getOptionLabel={(option) => (
          <Grid container spacing={1} alignItems="center">
            <Grid item>{option.private ? <Lock /> : <LockOpen />}</Grid>
            <Grid item>
              <Typography variant="body1" noWrap>
                <strong>{option?.name}</strong>
              </Typography>
            </Grid>
          </Grid>
        )}
        getOptionValue={(option) => option?.name}
        onChange={onChange}
        onAdd={() => setOpenCreateRepoDialog(true)}
      />
    </>
  );
};
export default RepoSelector;
