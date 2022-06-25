import { Card, CardContent, Chip, Grid } from "@mui/material";
import Editor from "../../components/inputs/editor";
import { loggedIn } from "../../hooks/login";
import AdminPanel from "../adminPanel";
import { SharedStringHelper } from "@fluid-experimental/react-inputs";
import { useRepoContext } from "../../contexts/repoContext";
import { useFluidContext } from "../../contexts/fluidContext";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import MarkdownDialog from "../../components/dialog/markdown";
import { Edit, Visibility, VisibilityOff } from "@mui/icons-material";
import useUser from "../../hooks/user/useUser";
import useRepo from "../../hooks/repos/useRepo";
import Chat from "../../components/chat";
import FirebaseProvider from "../../contexts/firebaseContext";

const Session = () => {
  const { sharedString, sharedMap } = useFluidContext();
  const { name, clearFile } = useRepoContext();
  const [path, setPath] = useState();
  const [markdown, setMarkdown] = useState();
  const [editMarkdownOpen, setEditMarkdownOpen] = useState(false);
  const [showMarkdown, setShowMarkdown] = useState(false);
  const [markdownFile, setMarkdownFile] = useState();
  const user = useUser();
  const { getFile } = useRepo(name, user.login);

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
      <Grid container spacing={1} sx={{ height: "100%" }}>
        {loggedIn() && (
          <Grid item xs={12} sm={4} lg={3} xl={2}>
            <AdminPanel />
          </Grid>
        )}
        {(sharedString || !!path) && (
          <Grid item container spacing={1} xs={12} sm={loggedIn() ? 8 : 12} lg={loggedIn() ? 9 : 12} xl={loggedIn() ? 10 : 12} sx={{ height: "100%" }}>
            <Grid item container justifyContent={!!path ? "space-between": "flex-end"} xs={12} sx={{ height: "4.5%" }}>
              {
                !!path &&
                <Grid item>
                  <Chip sx={{ borderRadius: 1.5 }} label={path} onDelete={loggedIn() ? handleClear : undefined} />
                </Grid>
              }
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
            </Grid>
            <Grid item container spacing={1} xs={12} sx={{ height: "95.5%" }}>
              <Grid item xs={12} lg={6} xl={8}>
                <Editor sharedStringHelper={new SharedStringHelper(sharedString)} />
              </Grid>
              <Grid item container xs={12} lg={6} xl={4}>
                {
                  !!markdown && showMarkdown &&
                  <Grid item xs={12}>
                    <Card>
                      <CardContent>
                        <ReactMarkdown>{markdown}</ReactMarkdown>
                      </CardContent>
                    </Card>
                  </Grid>
                }
                <Grid item xs={12} sx={{ height: showMarkdown ? "50%" : "100%"}}>
                  <FirebaseProvider>
                    <Chat/>
                  </FirebaseProvider>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default Session;
