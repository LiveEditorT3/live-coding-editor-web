import { useEffect, useState, useContext } from "react";
import { Button, Grid } from "@mui/material";
import { Save } from "@mui/icons-material";
import { RepoContext } from "../../contexts/repoContext";
import FileSelector from "../../components/inputs/selectors/fileSelector";
import { useFluidContext } from "../../contexts/fluidContext";
import { selectEditorMode } from "../../models/languageModes";
import RepoSelector from "../../components/inputs/selectors/repoSelector";
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
    fileContent,
    fileSHA,
    filepath,
    commitMessage,
    filesList,
    reposList,
    selectCurrentRepo,
    selectCurrentFile,
    refreshReposList,
  } = useContext(RepoContext);

  const { sharedMap, audience } = useFluidContext();
  const { app } = useFirebaseContext();
  const [messageOpen, setMessageOpen] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [peopleOpen, setPeopleOpen] = useState(false);

  // Set default repo to first one on the list
  // This hook should run only when repoName is still not set and repoList is set.
  useEffect(() => {
    if (!repoName && !!reposList && reposList.length > 0) {
      selectCurrentRepo(reposList[0].name);
    }
  }, [repoName, reposList, selectCurrentRepo]);

  useEffect(() => {
    if (!!audience) {
      audience.on("memberRemoved", (member) => {
        const db = getDatabase(app);
        remove(ref(db, `sessions${window.location.pathname}/${member.userId}`));
      });
    }
  }, [audience, app]);

  const handleCreateRepo = async (name, isPrivate) => {
    if (!!name) {
      try {
        const response = await ReposService.create(name, isPrivate);
        if (response.ok) {
          refreshReposList();
          selectCurrentRepo(name);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleCommit = async (event) => {
    try {
      await ReposService.commit(user.login, repoName, {
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
    const selectedRepoName = event.target.value;
    selectCurrentRepo(selectedRepoName);
    sharedMap.set("markdown", "");
  };

  const handleChangeFile = async (file) => {
    try {
      const res = await ReposService.getFile(user.login, repoName, file.name);
      selectCurrentFile(
        res.path,
        { content: res.content, refresh: true },
        res.sha
      );
      sharedMap.set("mode", selectEditorMode(file.name));
      sharedMap.set("file", file.name);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddFile = (newFilepath) => {
    selectCurrentFile(newFilepath, { content: "", refresh: true }, "");
    sharedMap.set("mode", selectEditorMode(newFilepath));
    sharedMap.set("file", newFilepath);
  };

  return (
    <>
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
                    repo={repoName}
                    repos={reposList}
                    onChange={handleChangeRepo}
                    onAccept={handleCreateRepo}
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
                    files={filesList?.filter(
                      (file) => file.name !== "README.md"
                    )}
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
