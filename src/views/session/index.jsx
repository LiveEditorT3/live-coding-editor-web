import { Chip, Grid } from "@mui/material";
import Editor from "../../components/inputs/editor";
import { useSharedString } from "../../hooks/editor/useSharedString";
import { loggedIn } from "../../hooks/login";
import AdminPanel from "../adminPanel";
import { SharedStringHelper } from "@fluid-experimental/react-inputs";
import { useRepoContext } from "../../contexts/repoContext";

const Session = () => {
  const sharedString = useSharedString();
  const { path, clearFile } = useRepoContext();
  return (
    <Grid container spacing={1}>
      {loggedIn() && (
        <Grid item xs={3}>
          <AdminPanel />
        </Grid>
      )}
      {(sharedString || !!path) && (
        <Grid item container spacing={1} xs={9}>
          {loggedIn() && !!path && (
            <Grid item xs={12}>
              <Chip label={path} onDelete={() => clearFile()} />
            </Grid>
          )}
          <Grid item xs={12}>
            <Editor sharedStringHelper={new SharedStringHelper(sharedString)} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default Session;
