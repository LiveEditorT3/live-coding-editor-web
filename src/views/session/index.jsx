import { useContext, useEffect, useState } from "react";
import { Chip, Grid, Typography } from "@mui/material";
import { LoginContext } from "../../contexts/loginContext";
import { useFluidContext } from "../../contexts/fluidContext";
import { RepoContext } from "../../contexts/repoContext";
import ReposService from "../../services/ReposService";
import Editor from "../../components/inputs/editor";
import { loggedIn } from "../../contexts/loginContext";
import AdminPanel from "../adminPanel";
import ReactMarkdown from "react-markdown";
import MarkdownDialog from "../../components/dialog/markdown";
import { Code, Edit, Visibility, VisibilityOff } from "@mui/icons-material";
import Chat from "../../components/chat";
import NameDialog from "../../components/dialog/name";
import { FirebaseContext } from "../../contexts/firebaseContext";
import { getDatabase, off, onValue, ref, remove, set } from "firebase/database";
import DisplayCard from "../../components/displayCard";
import { fileExtensionToIcon } from "../../models/supportedLanguages";
import { extractFilenameAndExtension } from "../../models/languageModes";

const Session = () => {
  const { sharedStringHelper } = useFluidContext();
  const { repoName, clearFile } = useContext(RepoContext);
  const [path, setPath] = useState();
  const [markdown, setMarkdown] = useState();
  const [editMarkdownOpen, setEditMarkdownOpen] = useState(false);
  const [showMarkdown, setShowMarkdown] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [markdownFile, setMarkdownFile] = useState();
  const [nameOpen, setNameOpen] = useState(true);
  const { user } = useContext(LoginContext);
  const { app } = useContext(FirebaseContext);

  useEffect(() => {
    const db = getDatabase(app);
    const pathRef = ref(db, `sessions${window.location.pathname}/path`);
    const markdownRef = ref(db, `sessions${window.location.pathname}/markdown`);
    onValue(pathRef, (snapshot) => {
      setPath(snapshot.val());
    });

    onValue(markdownRef, (snapshot) => {
      setMarkdown(snapshot.val());
    });

    return () => {
      off(pathRef);
      off(markdownRef);
    };
  }, [app]);

  useEffect(() => {
    window.addEventListener("beforeunload", () => {
      if (!loggedIn() && !!user.id) {
        const db = getDatabase(app);
        remove(ref(db, `participants${window.location.pathname}/${user.id}`));
      }
    });
  }, [app, user]);

  useEffect(() => {
    const getReadme = async () => {
      const db = getDatabase(app);
      const markdownRef = ref(
        db,
        `sessions${window.location.pathname}/markdown`
      );
      if (loggedIn() && !!user && !!repoName) {
        try {
          const file = await ReposService.getFile(
            user.login,
            repoName,
            "README.md"
          );
          setMarkdownFile(file);
          set(markdownRef, file.content);
        } catch (e) {
          setMarkdownFile({ path: "README.md" });
          set(markdownRef, "");
        }
      }
    };
    getReadme();
  }, [user, repoName, app]);

  const handleClear = (event) => {
    const db = getDatabase(app);
    const pathRef = ref(db, `sessions${window.location.pathname}/path`);
    set(pathRef, "");
    clearFile();
  };

  return (
    <>
      {loggedIn() && (
        <MarkdownDialog
          open={editMarkdownOpen}
          file={markdownFile}
          user={user?.login}
          repo={repoName}
          onClose={() => setEditMarkdownOpen(false)}
        />
      )}
      {!loggedIn() && !user.name && (
        <NameDialog open={nameOpen} onClose={() => setNameOpen(false)} />
      )}
      <Grid
        container
        spacing={1}
        sx={{ height: "100%", display: "flex", flexWrap: "nowrap" }}
      >
        {loggedIn() && (
          <Grid item>
            <AdminPanel />
          </Grid>
        )}
        <Grid item container spacing={1} sx={{ height: "100%", flex: 1 }}>
          <Grid
            item
            container
            justifyContent={!!path ? "space-between" : "flex-end"}
            xs={12}
          >
            {!!path && (
              <Grid item>
                <Chip
                  sx={{ borderRadius: 1.5 }}
                  label={path}
                  onDelete={loggedIn() ? handleClear : undefined}
                  icon={
                    <img
                      src={fileExtensionToIcon(
                        extractFilenameAndExtension(path).extension
                      )}
                      alt={path}
                      width={15}
                      height={15}
                    />
                  }
                />
              </Grid>
            )}
            <Grid item container spacing={1} xs={5} justifyContent="flex-end">
              <Grid item>
                <Chip
                  sx={{ borderRadius: 1.5 }}
                  icon={loggedIn() ? <Edit /> : undefined}
                  onClick={
                    loggedIn() ? () => setEditMarkdownOpen(true) : undefined
                  }
                  deleteIcon={showMarkdown ? <VisibilityOff /> : <Visibility />}
                  label={"README.md"}
                  onDelete={() => setShowMarkdown(!showMarkdown)}
                />
              </Grid>
              <Grid item>
                <Chip
                  sx={{ borderRadius: 1.5 }}
                  deleteIcon={showChat ? <VisibilityOff /> : <Visibility />}
                  label={"Chat"}
                  onDelete={() => setShowChat(!showChat)}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            container
            spacing={1}
            xs={12}
            sx={{ height: "100%", display: "flex", flexWrap: "nowrap" }}
          >
            {
              <Grid
                item
                sx={{
                  flex: 1,
                  overflow: "auto",
                  height: "85.2vh",
                  marginTop: "7px",
                }}
              >
                {!!path && !!sharedStringHelper ? (
                  <Editor sharedStringHelper={sharedStringHelper} />
                ) : (
                  <Grid container spacing={5}>
                    <Grid item xs={2} container justifyContent="flex-end">
                      <Code sx={{ fontSize: "50pt", color: "gray" }} />
                    </Grid>
                    <Grid item xs={10}>
                      <Typography color="gray" variant="h4">
                        {loggedIn()
                          ? "Get Started"
                          : "Session will start shortly"}
                      </Typography>
                      <Typography color="gray">
                        {loggedIn()
                          ? "Select or create a file and start editing"
                          : "Waiting for the host to choose a file!"}
                      </Typography>
                    </Grid>
                  </Grid>
                )}
              </Grid>
            }
            <Grid
              item
              container
              xs={showMarkdown || showChat ? 12 : "auto"}
              lg={showMarkdown || showChat ? 5 : "auto"}
              xl={showMarkdown || showChat ? 4 : "auto"}
              spacing={1}
              justifyContent="flex-end"
              sx={{ height: "100%" }}
            >
              <Grid
                item
                xs={12}
                sx={{
                  height: showChat ? "41.5vh" : "85.2vh",
                  display: !!markdown && showMarkdown ? "block" : "none",
                }}
              >
                <DisplayCard
                  height={"100%"}
                  overflow={"auto"}
                  wordBreak={"break-word"}
                  maxHeight={showChat ? "41.5vh" : "85.2vh"}
                >
                  <ReactMarkdown>{markdown}</ReactMarkdown>
                </DisplayCard>
              </Grid>
              <Grid
                item
                xs={12}
                sx={{
                  height: !!markdown && showMarkdown ? "41.5vh" : "85.2vh",
                  display: showChat ? "block" : "none",
                }}
              >
                <Chat compact={!!markdown && showMarkdown} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Session;
