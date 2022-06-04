import { Grid } from "@mui/material";
import Editor from "../../components/inputs/editor";
import { useSharedString } from "../../hooks/editor/useSharedString";
import { loggedIn } from "../../hooks/login";
import AdminPanel from "../adminPanel";
import { SharedStringHelper } from "@fluid-experimental/react-inputs";

const Session = () => {
  const sharedString = useSharedString();
  return (
    <Grid container spacing={1}>
      {loggedIn() && (
        <Grid item xs={3}>
          <AdminPanel />
        </Grid>
      )}
      {sharedString && (
        <Grid item xs={9}>
          <Editor sharedStringHelper={new SharedStringHelper(sharedString)} />
        </Grid>
      )}
    </Grid>
  );
};

export default Session;
