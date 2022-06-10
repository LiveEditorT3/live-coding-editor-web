import { useEffect, useState } from "react";
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
} from "@mui/material";
import { Lock, LockOpen, Save } from "@mui/icons-material";
import { useRepoContext } from "../../contexts/repoContext";
import useRepo from "../../hooks/repos/useRepo";
import FileSelector from "../../components/inputs/selectors/fileSelector";
import { useFluidContext } from "../../contexts/fluidContext";
import { selectEditorMode } from "../../models/languageModes";
import RepoSelector from "../../components/inputs/selectors/repoSelector";

const AdminPanel = () => {
  const user = useUser();
  const {
    name,
    isPrivate,
    fileContent,
    sha,
    path,
    message,
    setRepoName,
    setRepoPrivate,
    setFile,
    setCommitMessage,
    setContent,
    setFileSha,
  } = useRepoContext();

  const { sharedMap } = useFluidContext();
  const classes = useStyles();
  const [sent, setSent] = useState(false);
  const { repos, createRepo, commitFile } = useRepos(sent);
  const [repo, setRepo] = useState();
  const [open, setOpen] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const { files, getFile } = useRepo(repo, user.login);

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
    commitFile(user.login, repo, {
      content: fileContent.content,
      path,
      message,
      sha,
    }).then(() => setMessageOpen(false));
  };

  const handleChangeRepo = (event) => {
    const selected = event.target.value;
    if (!!selected) setRepo(selected);
  };

  const handleChangeFile = (file) => {
    getFile(file.name).then((res) => {
      setFile(res.path);
      sharedMap.set("mode", selectEditorMode(file.name))
      setContent(res.content, true);
      setFileSha(res.sha);
    });
  };

  const handleAddFile = (name) => {
    setFile(name);
    sharedMap.set("mode", selectEditorMode(name))
    setContent("", true);
    setFileSha("");
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
      <Dialog
        open={messageOpen}
        title="Commit Changes"
        onClose={() => setMessageOpen(false)}
        onAccept={handleCommit}
      >
        <TextField
          fullWidth
          label="Message"
          placeholder="Enter a commit message"
          value={message}
          onChange={(event) => setCommitMessage(event.target.value)}
        />
      </Dialog>
      <Paper className={classes.paper}>
        <Grid container direction="column" spacing={1} columns={1}>
          <Grid item>
            <RepoSelector
              repo={repo}
              repos={repos}
              onAdd={() => setOpen(true)}
              onChange={handleChangeRepo}
            />
          </Grid>
          <Grid item>
            <FileSelector
              files={files}
              onSelect={handleChangeFile}
              onAddFile={handleAddFile}
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
