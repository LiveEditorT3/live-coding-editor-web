import { useEffect, useState, useContext } from "react";
import { Button, Grid } from "@mui/material";
import { Save } from "@mui/icons-material";
import { RepoContext } from "../../contexts/repoContext";
import FileSelector from "../../components/inputs/selectors/fileSelector";
import { useFluidContext } from "../../contexts/fluidContext";
import { selectEditorMode } from "../../models/languageModes";
import RepoSelector from "../../components/inputs/selectors/repoSelector";
import CreateRepoDialog from "../../components/dialog/createRepo";
import CommitDialog from "../../components/dialog/commit";
import { getDatabase, ref, remove } from "firebase/database";
import { useFirebaseContext } from "../../contexts/firebaseContext";
import PeopleSelector from "../../components/inputs/selectors/peopleSelector";
import Tab from "../../components/buttons/tab";
import DisplayCard from "../../components/displayCard";
import { LoginContext } from "../../contexts/loginContext";
import ReposService from "../../services/ReposService";

const AdminPanel = () => {
  const { user } = useContext(LoginContext);
  const {
    repoName,
    repoIsPrivate,
    fileContent,
    fileSHA,
    filepath,
    commitMessage,
    setRepoName,
    setFilepath,
    setFileContent,
    setFileSHA,
  } = useContext(RepoContext);

  const { sharedMap, audience } = useFluidContext();
  const { app } = useFirebaseContext();
  const [sent, setSent] = useState(false);
  const [repos, setRepos] = useState([]);
  const [repo, setRepo] = useState();
  const [open, setOpen] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [peopleOpen, setPeopleOpen] = useState(false);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const getFiles = async () => {
      const res = await ReposService.getFiles(user.login, repo);
      setFiles(res);
    };
    if (!!user.login && !!repo) getFiles();
  }, [repo, user.login]);

  useEffect(() => {
    const getRepos = async () => {
      const res = await ReposService.get();
      setRepos(res);
    };
    getRepos();
  }, [sent]);

  useEffect(() => {
    if (!repo && !!repos && !!repos.length) {
      setRepo(repos[0].name);
      setRepoName(repos[0].name);
    }
  }, [repos, open, messageOpen, repo, setRepoName]);

  useEffect(() => {
    if (!!audience) {
      audience.on("memberRemoved", (member) => {
        const db = getDatabase(app);
        remove(ref(db, `sessions${window.location.pathname}/${member.userId}`));
      });
    }
  }, [audience, app]);

  const handleCreate = async (event) => {
    try {
      await ReposService.create(repoName, repoIsPrivate);
    } catch (err) {
      console.error(err);
    }
    setSent(true);
    setRepo(repoName);
    setOpen(false);
  };

  const handleCommit = async (event) => {
    try {
      await ReposService.commit(user.login, repo, {
        content: fileContent.content,
        path: filepath,
        message: commitMessage,
        sha: fileSHA,
      });
    } catch (err) {
      console.error(err);
    }
    setMessageOpen(false);
  };

  const handleChangeRepo = (event) => {
    const selected = event.target.value;
    if (!!selected) setRepo(selected);
    setRepoName(selected);
    sharedMap.set("markdown", "");
  };

  const handleChangeFile = async (file) => {
    try {
      const res = await ReposService.getFile(user.login, repo, file.name);
      setFilepath(res.path);
      sharedMap.set("mode", selectEditorMode(file.name));
      sharedMap.set("file", file.name);
      setFileContent({ content: res.content, refresh: true });
      setFileSHA(res.sha);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddFile = (name) => {
    setFilepath(name);
    sharedMap.set("mode", selectEditorMode(name));
    sharedMap.set("file", name);
    setFileContent({ content: "", refresh: true });
    setFileSHA("");
  };

  return (
    <>
      <CreateRepoDialog
        open={open}
        onClose={() => setOpen(false)}
        onAccept={handleCreate}
      />
      <CommitDialog
        open={messageOpen}
        onClose={() => setMessageOpen(false)}
        onAccept={handleCommit}
      />
      <Grid
        container
        spacing={2}
        direction="row"
        sx={{
          height: "100%",
          minWidth: peopleOpen || optionsOpen ? "25vw" : "4vw",
        }}
      >
        <Grid item container spacing={1} direction="column" xs={2}>
          <Grid item>
            <Tab
              label="Options"
              open={optionsOpen}
              onOpen={() => setOptionsOpen((prev) => !prev)}
            />
          </Grid>
          <Grid item>
            <Tab
              label="People"
              open={peopleOpen}
              onOpen={() => setPeopleOpen((prev) => !prev)}
            />
          </Grid>
        </Grid>
        <Grid
          item
          container
          spacing={1}
          direction="column"
          xs={10}
          sx={{ display: peopleOpen || optionsOpen ? "flex" : "none" }}
        >
          <Grid
            item
            sx={{
              height: peopleOpen ? "44vh" : "88vh",
              display: optionsOpen ? "flex" : "none",
              width: "100%",
            }}
          >
            <DisplayCard
              title="Options"
              height={"100%"}
              width={"100%"}
              overflow={"auto"}
            >
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
                  <Button
                    variant="outlined"
                    fullWidth
                    endIcon={<Save />}
                    onClick={() => setMessageOpen(true)}
                  >
                    Save
                  </Button>
                </Grid>
                <Grid item>
                  <FileSelector
                    files={files?.filter((file) => file.name !== "README.md")}
                    onSelect={handleChangeFile}
                    onAddFile={handleAddFile}
                  />
                </Grid>
              </Grid>
            </DisplayCard>
          </Grid>
          <Grid
            item
            sx={{
              height: optionsOpen ? "44vh" : "88vh",
              display: peopleOpen ? "flex" : "none",
            }}
          >
            <DisplayCard
              title="People"
              height={"100%"}
              width={"100%"}
              overflow={"auto"}
            >
              <Grid container direction="column" spacing={1} columns={1}>
                <Grid item>
                  <PeopleSelector />
                </Grid>
              </Grid>
            </DisplayCard>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default AdminPanel;
