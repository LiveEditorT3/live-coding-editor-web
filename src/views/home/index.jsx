import { Grid, Typography } from "@mui/material";
import LogIntoGithubButton from "../../components/buttons";

const Home = () => {
  return (
    <Grid container spacing={1} direction="column" justifyContent="center">
      <Typography align="center" variant="h3">
        Welcome!
      </Typography>
      <Grid item container xs={12} justifyContent="center">
        <LogIntoGithubButton />
      </Grid>
    </Grid>
  );
};

export default Home;
