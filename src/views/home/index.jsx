import { Button, Card, CardContent, CardHeader, FormHelperText, Grid, ImageList, ImageListItem, InputAdornment, OutlinedInput, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogIntoGithubButton from "../../components/buttons";
import { supportedLanguages } from "../../models/supportedLanguages";

const Home = () => {
  const [session, setSession] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleJoin = (event) => {
    if (!session || !session.includes("#"))
      return setError(true);
    let id = session;
    if (id.includes(window.location.origin))
      id = session.substring(window.location.origin.length);
    navigate(id);
  }

  const handlePaste = (event) => {
    setError(false);
    setSession(event.clipboardData.getData("text"));
  }

  return (
    <Grid container spacing={1} justifyContent="center" sx={{ padding: "1%", marginTop:"1%"}}>
      <Grid item xs={7} container spacing={1}>
        <Grid item xs={12}>
          <Typography variant="h3" align="center">
             Collaborative Code Editor 
          </Typography>
          <Typography variant="h5" align="center">
            Store your session files on GitHub 
          </Typography>
        </Grid>
        <Grid item container xs={12} justifyContent="center" direction="column">
          <Typography align="center" variant="caption">
            Supported languages:
          </Typography>
          <ImageList variant="masonry" cols={3} gap={38} sx={{ margin: "5%", maxWidth: "20vw", justifyContent: "center"}}>
            {
              supportedLanguages.map((lang) => (
                <ImageListItem key={lang.name} cols={lang.cols || 1} rows={lang.rows || 1}>
                  <img 
                    src={`${lang.iconUrl}?w=248&fit=crop&auto=format`}
                    srcSet={`${lang.iconUrl}?w=248&fit=crop&auto=format&dpr=2 2x`}
                    alt={lang.name}
                    loading="lazy"
                  />
                </ImageListItem>
              ))
            }
          </ImageList>
        </Grid>
      </Grid>
      <Grid item container xs={5} spacing={3} alignItems="center">
        <Grid item container xs={12} spacing={1} justifyContent="flex-end">
          <Card sx={{width: "100%"}}>
            <CardHeader title="Start a session!" action={
              <LogIntoGithubButton />
            }/>
            <CardContent>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography>
                    To connect to github and start a new session, click the button
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item container xs={12} spacing={1} justifyContent="flex-end">
          <Card>
            <CardHeader title="Join a session!"/>
            <CardContent>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography>
                    To connect to an existing session, paste the link or session id below
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <OutlinedInput
                    size="small"
                    fullWidth
                    placeholder="Paste session id or link here"
                    error={error}
                    value={session}
                    onPaste={handlePaste}
                    endAdornment={
                        <InputAdornment position="end">
                          <>
                            <Button onClick={() => setSession("")}>Clear</Button>
                            <Button disabled={!session} onClick={handleJoin}>Join</Button>
                          </>
                        </InputAdornment>
                    }
                  />
                  {
                    !!error &&
                    <FormHelperText error>Invalid format</FormHelperText>
                  }
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Home;
