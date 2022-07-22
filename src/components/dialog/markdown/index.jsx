import { useContext, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Grid, TextField } from "@mui/material";
import { getDatabase, ref, set } from "firebase/database";
import { FirebaseContext } from "../../../contexts/firebaseContext";
import ReposService from "../../../services/ReposService";
import Dialog from "..";

const MarkdownDialog = ({ open, file, user, repo, onClose }) => {
  const [markdown, setMarkdown] = useState();
  const { app } = useContext(FirebaseContext);

  const handleAccept = async (event) => {
    try {
      await ReposService.commit(user, repo, {
        content: markdown,
        path: file.path,
        message: "Updated README.md",
        sha: file.sha,
      });
    } catch (err) {
      console.error(err);
    }
    const db = getDatabase(app);
    const markdownRef = ref(db, `sessions${window.location.pathname}/markdown`);
    set(markdownRef, markdown);
    onClose();
  };

  useEffect(() => {
    setMarkdown(file?.content || "");
  }, [file]);

  return (
    <Dialog
      open={open}
      title="README.md"
      onClose={onClose}
      onAccept={handleAccept}
      maxWidth="xl"
    >
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            multiline
            minRows={20}
            maxRows={25}
            placeholder="Type here..."
            value={markdown}
            onChange={(event) => setMarkdown(event.target.value)}
            InputProps={{ style: { fontFamily: "monospace" } }}
          />
        </Grid>
        <Grid item xs={6} sx={{ maxHeight: "60vh", overflow: "auto" }}>
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default MarkdownDialog;
