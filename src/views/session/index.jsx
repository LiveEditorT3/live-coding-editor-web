import { Chip, Grid } from "@mui/material";
import Editor from "../../components/inputs/editor";
import { loggedIn } from "../../hooks/login";
import AdminPanel from "../adminPanel";
import { useRepoContext } from "../../contexts/repoContext";
import { useFluidContext } from "../../contexts/fluidContext";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import MarkdownDialog from "../../components/dialog/markdown";
import { Edit, Visibility, VisibilityOff } from "@mui/icons-material";
import useUser from "../../hooks/user/useUser";
import useRepo from "../../hooks/repos/useRepo";
import Chat from "../../components/chat";
import NameDialog from "../../components/dialog/name";
import { useFirebaseContext } from "../../contexts/firebaseContext";
import { getDatabase, ref, remove } from "firebase/database";
import DisplayCard from "../../components/displayCard";

const Session = () => {
  const { sharedStringHelper, sharedMap } = useFluidContext();
  const { name, clearFile } = useRepoContext();
  const [path, setPath] = useState();
  const [markdown, setMarkdown] = useState();
  const [editMarkdownOpen, setEditMarkdownOpen] = useState(false);
  const [showMarkdown, setShowMarkdown] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [markdownFile, setMarkdownFile] = useState();
  const [nameOpen, setNameOpen] = useState(true);
  const user = useUser();
  const { getFile } = useRepo(name, user.login);
  const { app } = useFirebaseContext();

  useEffect(() => {
    if (sharedMap !== undefined) {
      
      const syncView = () => {
        setPath(sharedMap.get("file"))
        setMarkdown(sharedMap.get("markdown"))
      }
      
      syncView();
      sharedMap.on("valueChanged", syncView);
      // turn off listener when component is unmounted
      return () => { sharedMap.off("valueChanged", syncView) }
    }
  
  }, [sharedMap])

  useEffect(() => {
    window.addEventListener("beforeunload", () => {
      if (!loggedIn() && !!user.id) {
        const db = getDatabase(app);
        remove(ref(db, `sessions${window.location.pathname}/${user.id}`));
      }
    })
  }, [app, user.id])

  useEffect(() => {
    if (!!user && !!name && !!sharedMap)
        getFile("README.md")
            .then(file => {
                setMarkdownFile(file)
                sharedMap.set("markdown", file.content)
            })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name])

  const handleClear = (event) => {
    sharedMap.set("file", "");
    clearFile();
  }

  return (
    <>
      {
        loggedIn() &&
        <MarkdownDialog 
          open={editMarkdownOpen} 
          file={markdownFile} 
          user={user.login}
          repo={name}
          onClose={() => setEditMarkdownOpen(false)} 
        />
      }
      {
        !loggedIn() && !user.name &&
        <NameDialog
          open={nameOpen}
          onClose={() => setNameOpen(false)}
          />
      }
      <Grid container spacing={1} sx={{ height: "100%", display: "flex", flexWrap: "nowrap" }}>
        {loggedIn() && (
          <Grid item>
            <AdminPanel />
          </Grid>
        )}
        <Grid item container spacing={1} sx={{ height: "100%", flex: 1 }}>
          <Grid item container justifyContent={!!path ? "space-between": "flex-end"} xs={12} sx={{ height: "4.5%" }}>
            {
              !!path &&
              <Grid item>
                <Chip sx={{ borderRadius: 1.5 }} label={path} onDelete={loggedIn() ? handleClear : undefined} />
              </Grid>
            }
            <Grid item container spacing={1} xs={5} justifyContent="flex-end">
              <Grid item>
                <Chip 
                  sx={{ borderRadius: 1.5 }} 
                  icon={loggedIn() ? <Edit/> : undefined} 
                  onClick={loggedIn() ? () => setEditMarkdownOpen(true) : undefined} 
                  deleteIcon={showMarkdown ? <VisibilityOff/> : <Visibility/>} 
                  label={"README.md"} 
                  onDelete={() => setShowMarkdown(!showMarkdown)} 
                />
              </Grid>
              <Grid item>
                <Chip 
                  sx={{ borderRadius: 1.5 }} 
                  deleteIcon={showChat ? <VisibilityOff/> : <Visibility/>} 
                  label={"Chat"} 
                  onDelete={() => setShowChat(!showChat)} 
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item container spacing={1} xs={12} sx={{ height: "100%", display: "flex", flexWrap: "nowrap" }}>
            {
              <Grid item sx={{ flex: 1}}>
                {sharedStringHelper && <Editor sharedStringHelper={sharedStringHelper} />}
              </Grid>
            }
            <Grid item container xs={12} lg={6} xl={4} spacing={1} justifyContent="flex-end" sx={{ height: "100%" }}>
              <Grid item xs={12} sx={{ height: showChat ? "50%" : "100%", display: !!markdown && showMarkdown ? "block" : "none"}}>
                <DisplayCard height={"100%"}>
                    <ReactMarkdown>{markdown}</ReactMarkdown>
                </DisplayCard>
              </Grid>
              <Grid item xs={12} sx={{ height: showMarkdown ? "50%" : "100%", display: showChat ? "block" : "none"}}>
                <Chat/>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Session;
