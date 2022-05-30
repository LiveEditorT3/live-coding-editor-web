import { useEffect, useState } from "react";
import Dropdown from "../../components/inputs/dropdown";
import useRepos from "../../hooks/repos/useRepos";
import useUser from "../../hooks/user/useUser";
import useStyles from "./styles";
import Dialog from "../../components/dialog";
import {
  Button,
  Checkbox,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Lock, LockOpen, Save } from "@mui/icons-material";
import { useRepo } from "../../contexts/repoContext";

const modes = [
  { label: "Go", value: "go" },
  { label: "Javascript", value: "javascript" },
  { label: "Python", value: "python" },
];

const AdminPanel = () => {
  const user = useUser();
  const {
    name,
    isPrivate,
    commit,
    mode,
    setRepoName,
    setRepoPrivate,
    setFileName,
    setCommitMessage,
    setEditorMode,
  } = useRepo();
  const classes = useStyles();
  const [sent, setSent] = useState(false);
  const { repos, createRepo, commitFile } = useRepos(sent);
  const [repo, setRepo] = useState();
  const [open, setOpen] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);

  useEffect(() => {
    if (!repo && !!repos && !!repos.length) setRepo(repos[0].name);
  }, [repos, open, messageOpen, repo]);

  const handleCreate = (event) => {
    createRepo(name, isPrivate);
    setSent(true);
    setRepo(name);
    setOpen(false);
  };

  const handleCommit = (event) => {
    commitFile(user.login, repo, commit).then(() => setMessageOpen(false));
  };

  const handleChangeRepo = (event) => {
    const selected = event.target.value;
    if (!!selected) setRepo(selected);
  };

  return (
    <>
      <Dialog
        open={open}
        title="Create Repo"
        onClose={() => setOpen(false)}
        onAccept={handleCreate}
      >
        <Grid container spacing={1}>
          <Grid item xs={9}>
            <TextField
              fullWidth
              value={name}
              onChange={(event) => setRepoName(event.target.value)}
            />
          </Grid>
          <Grid item xs={3}>
            <Checkbox
              checked={isPrivate}
              onChange={(event) => setRepoPrivate(event.target.checked)}
            />
            <Typography variant="caption">Private</Typography>
          </Grid>
        </Grid>
      </Dialog>
      <Dialog
        open={messageOpen}
        title="Commit Message"
        onClose={() => setMessageOpen(false)}
        onAccept={handleCommit}
      >
        <TextField
          fullWidth
          value={commit.message}
          onChange={(event) => setCommitMessage(event.target.value)}
        />
      </Dialog>
      <Grid container direction="column" spacing={1}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Grid container spacing={1} alignItems="center">
              <Grid item xs={3}>
                <Dropdown
                  size="small"
                  fullWidth
                  options={repos}
                  value={repo || ""}
                  getOptionLabel={(option) => (
                    <Grid container spacing={1} alignItems="center">
                      <Grid item>
                        {option.private ? <Lock /> : <LockOpen />}
                      </Grid>
                      <Grid item>
                        <Typography variant="body1">
                          <strong>{option?.name}</strong>
                        </Typography>
                      </Grid>
                    </Grid>
                  )}
                  getOptionValue={(option) => option?.name}
                  onChange={handleChangeRepo}
                  onAdd={() => setOpen(true)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={commit.path}
                  onChange={(event) => setFileName(event.target.value)}
                  style={{
                    fontWeight: "bold",
                  }}
                />
              </Grid>
              <Grid item xs={2}>
                <Dropdown
                  size="small"
                  fullWidth
                  options={modes}
                  value={mode || ""}
                  getOptionLabel={(option) => option?.label}
                  getOptionValue={(option) => option?.value}
                  onChange={(event) => setEditorMode(event.target.value)}
                />
              </Grid>
              <Grid item xs={1}>
                <Button
                  variant="outlined"
                  fullWidth
                  endIcon={<Save />}
                  onClick={() => setMessageOpen(true)}
                >
                  Save
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default AdminPanel;
