import { useEffect, useRef, useState } from "react";
import { Button, Checkbox, Grid, Paper, TextField, Typography } from "@material-ui/core";
import { Save } from "@material-ui/icons";
import Dropdown from "../../components/inputs/dropdown";
import useRepos from "../../hooks/repos/useRepos"
import useUser from "../../hooks/user/useUser";
import useStyles from './styles'
import Dialog from "../../components/dialog";

const Home = () => {
    const { user } = useUser()
    const classes = useStyles()
    const [sent, setSent] = useState(false)
    const { repos, createRepo, commitFile } = useRepos(sent);
    const [repo, setRepo] = useState()
    const [name, setName] = useState('')
    const [isPrivate, setPrivate] = useState(true)
    const [open, setOpen] = useState(false)
    const [messageOpen, setMessageOpen] = useState(false)
    const [commit, setCommit] = useState({
        content: '',
        path: 'untitled.py',
        message: '',
    })
    const codeRef = useRef(null)

    useEffect(() => {
        if (!repo && !!repos && !!repos.length)
            setRepo(repos[0].name)
    }, [repos, open, messageOpen, repo])
    const handleCreate = (event) => {
        createRepo(name, isPrivate)
        setSent(true)
        setRepo(name)
        setOpen(false)
    }

    const handleCommit = (event) => {
        commitFile(user.login, repo, commit)
            .then(() => setMessageOpen(false))
    }

    const handleChangeRepo = (event) => {
        const selected = event.target.value
        if (!!selected) setRepo(selected)
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Tab' && !event.shiftKey)
            setCommit({ ...commit, content: commit.content.concat('\t')})
    }

    console.log(repo)
    return(
        <>
            <Dialog open={open} title='Create Repo' onClose={() => setOpen(false)} onAccept={handleCreate}>
                <Grid container spacing={1}>
                    <Grid item xs={9}> 
                        <TextField
                            fullWidth
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Checkbox checked={isPrivate} onChange={(event) => setPrivate(event.target.checked)}/>
                        <Typography variant="caption">Private</Typography>
                    </Grid>
                </Grid>
            </Dialog>
            <Dialog open={messageOpen} title='Commit Message' onClose={() => setMessageOpen(false)} onAccept={handleCommit}>
                <TextField
                    fullWidth
                    value={commit.message}
                    onChange={(event) => setCommit({ ...commit, message: event.target.value })}
                />
            </Dialog>
            <Grid container direction='column' spacing={1}>
                <Grid item xs={12} >
                    <Paper className={classes.paper}>
                        <Grid container spacing={1} direction='column'>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1"><strong>{user?.login}</strong></Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Dropdown
                                    fullWidth
                                    options={repos}
                                    value={repo || ''}
                                    getOptionLabel={(option) => 
                                        <Grid container spacing={1} alignItems='center'>
                                            <Grid item>
                                                <Typography variant="body1"><strong>{option?.name}</strong></Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="caption"><i>{option?.visibility}</i></Typography>
                                            </Grid>
                                        </Grid>
                                    }
                                    getOptionValue={(option) => option?.name}
                                    onChange={handleChangeRepo}
                                    onAdd={() => setOpen(true)}
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <TextField variant="outlined"
                        fullWidth
                        value={commit.path}
                        onChange={(event) => setCommit({ ...commit, path: event.target.value} )}
                        style={{
                            fontWeight: 'bold',
                        }}
                    />
                </Grid>
                <Grid item container xs={12} justifyContent='flex-end'>
                    <Grid item xs={12}>
                        <TextField className={classes.inputField}
                            variant="outlined" 
                            multiline
                            fullWidth
                            minRows={30}
                            ref={codeRef    }
                            value={commit.content} 
                            onChange={(event) => setCommit({ ...commit, content: event.target.value} )} 
                            onKeyDown={handleKeyDown}
                        />
                    </Grid>
                    <Grid item>
                        <Button color="secondary" endIcon={<Save/>} onClick={() => setMessageOpen(true)}>Save</Button>
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}

export default Home