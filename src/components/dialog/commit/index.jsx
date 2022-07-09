import { TextField } from "@mui/material";
import Dialog from "..";
import { useRepoContext } from "../../../contexts/repoContext";

const CommitDialog = ({ open, onClose, onAccept }) => {
  const { message, setCommitMessage } = useRepoContext();

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
        value={message}
        onChange={(event) => setCommitMessage(event.target.value)}
      />
    </Dialog>
  );
};
export default CommitDialog;
