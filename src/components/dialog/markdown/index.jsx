import { Grid, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import Dialog from "..";
import { useFluidContext } from "../../../contexts/fluidContext";
import useRepos from "../../../hooks/repos/useRepos";

const MarkdownDialog = ({ open, file, user, repo, onClose }) => {
  const [markdown, setMarkdown] = useState();
  const { sharedMap } = useFluidContext();
  const { commitFile } = useRepos();

  const handleAccept = (event) => {
    commitFile(user, repo, {
      content: markdown,
      path: file.path,
      message: "Updated README.md",
      sha: file.sha,
    }).then(() => {
      sharedMap.set("markdown", markdown);
      onClose();
    });
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
