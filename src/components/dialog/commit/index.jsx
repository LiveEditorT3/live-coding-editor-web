import { useContext } from "react";
import { TextField } from "@mui/material";
import Dialog from "..";
import { RepoContext } from "../../../contexts/repoContext";

const CommitDialog = ({ open, onClose, onAccept }) => {
  const { commitMessage, setCommitMessage } = useContext(RepoContext);

  return (
    <Dialog
      open={open}
      title="Commit Changes"
      onClose={onClose}
      onAccept={onAccept}
    >
      <TextField
        fullWidth
        label="Message"
        placeholder="Enter a commit message"
        value={commitMessage}
        onChange={(event) => setCommitMessage(event.target.value)}
      />
    </Dialog>
  );
};
export default CommitDialog;
