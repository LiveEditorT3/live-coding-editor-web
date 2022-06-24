import { useEffect, useState } from "react";
import useRepos from "../../hooks/repos/useRepos";
import useUser from "../../hooks/user/useUser";
import useStyles from "./styles";
import {
  Button,
  Grid,
  Paper,
} from "@mui/material";
import { Save } from "@mui/icons-material";
import { useRepoContext } from "../../contexts/repoContext";
import useRepo from "../../hooks/repos/useRepo";
import FileSelector from "../../components/inputs/selectors/fileSelector";
import { useFluidContext } from "../../contexts/fluidContext";
import { selectEditorMode } from "../../models/languageModes";
import RepoSelector from "../../components/inputs/selectors/repoSelector";
import CreateRepoDialog from "../../components/dialog/createRepo";
import CommitDialog from "../../components/dialog/commit";

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
    setFile,
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
    if (!repo && !!repos && !!repos.length) {
      setRepo(repos[0].name);
      setRepoName(repos[0].name)
    }
  }, [repos, open, messageOpen, repo, setRepoName]);

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
    setRepoName(selected);
    sharedMap.set("markdown", "");
  };

  const handleChangeFile = (file) => {
    getFile(file.name).then((res) => {
      setFile(res.path);
      sharedMap.set("mode", selectEditorMode(file.name));
      sharedMap.set("file", file.name);
      setContent(res.content, true);
      setFileSha(res.sha);
    });
  };

  const handleAddFile = (name) => {
    setFile(name);
    sharedMap.set("mode", selectEditorMode(name))
    sharedMap.set("file", name);
    setContent("", true);
    setFileSha("");
  };

  return (
    <>
      <CreateRepoDialog open={open} onClose={() => setOpen(false)} onAccept={handleCreate} />
      <CommitDialog open={messageOpen} onClose={() => setMessageOpen(false)} onAccept={handleCommit} />
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
              files={files?.filter(file => file.name !== "README.md")}
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
