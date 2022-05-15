import { Grid } from "@mui/material";
import Editor from "../../components/inputs/editor";
import { useSharedString } from "../../hooks/editor/useSharedString";
import { loggedIn } from "../../hooks/login";
import AdminPanel from "../adminPanel";
import { SharedStringHelper } from "@fluid-experimental/react-inputs";

const Session = () => {
  const sharedString = useSharedString();
  return (
    <Grid container spacing={1} direction="column">
      {loggedIn() && (
        <Grid item xs={12}>
          <AdminPanel />
        </Grid>
      )}
      {sharedString && (
        <Grid item xs={12}>
          <Editor sharedStringHelper={new SharedStringHelper(sharedString)} />
        </Grid>
      )}
    </Grid>
  );
};

export default Session;
