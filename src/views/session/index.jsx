import { Chip, Grid } from "@mui/material";
import Editor from "../../components/inputs/editor";
import { loggedIn } from "../../hooks/login";
import AdminPanel from "../adminPanel";
import { SharedStringHelper } from "@fluid-experimental/react-inputs";
import { useRepoContext } from "../../contexts/repoContext";
import { useFluidContext } from "../../contexts/fluidContext";

const Session = () => {
  const { sharedString } = useFluidContext();
  const { path, clearFile } = useRepoContext();
  return (
    <Grid container spacing={1} sx={{ height: "100%" }}>
      {loggedIn() && (
        <Grid item xs={3}>
          <AdminPanel />
        </Grid>
      )}
      {(sharedString || !!path) && (
        <Grid item container spacing={1} xs={9} sx={{ height: "100%" }}>
          {loggedIn() && !!path && (
            <Grid item xs={12} sx={{ height: "4.5%" }}>
              <Chip sx={{ borderRadius: 1.5 }} label={path} onDelete={() => clearFile()} />
            </Grid>
          )}
          <Grid item xs={12} sx={{ height: "95.5%" }}>
            <Editor sharedStringHelper={new SharedStringHelper(sharedString)} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default Session;
