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
import { useRepoContext } from "../../contexts/repoContext";
import { modes, modesForSelect } from "../../models/languageModes";
import useRepo from "../../hooks/repos/useRepo";

const AdminPanel = (props) => {
  const sharedStringHelper = props.sharedStringHelper;
  const user = useUser();
  const {
    name,
    isPrivate,
    fileContent,
    path,
    message,
    mode,
    setRepoName,
    setRepoPrivate,
    setFileName,
    setFileExtension,
    setCommitMessage,
    setEditorMode,
    setContent
  } = useRepoContext();
  const classes = useStyles();
  const [sent, setSent] = useState(false);
  const { repos, createRepo, commitFile } = useRepos(sent);
  const [repo, setRepo] = useState();
  const [open, setOpen] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const { files, getFile } = useRepo(repo, user.login)

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
    commitFile(user.login, repo, { content: fileContent, path: path.name + path.extension, message }).then(() => setMessageOpen(false));
  };

  const handleChangeRepo = (event) => {
    const selected = event.target.value;
    if (!!selected) setRepo(selected);
  };

  const handleChangeFile = (event) => {
    const file = event.target.value
    const parts = file.split('.')
    getFile(file)
      .then(res => {
        setFileName(file)
        setFileExtension(modes[parts[1]])
        const text = sharedStringHelper.getText()
        sharedStringHelper.replaceText(res.content, 0, text.length)
      })
  }
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
          value={message}
          onChange={(event) => setCommitMessage(event.target.value)}
        />
      </Dialog>
        <Paper className={classes.paper}>
          <Grid container direction="column" spacing={1} columns={1}>
            <Grid item>
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
            <Grid item>
              <Dropdown
                variant="outlined"
                size="small"
                fullWidth
                options={files}
                value={path.name || ""}
                onChange={handleChangeFile}
                getOptionLabel={(option) => option?.name}
                getOptionValue={(option) => option?.path}
              />
            </Grid>
            <Grid item>
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
    </>
  );
};

export default AdminPanel;
