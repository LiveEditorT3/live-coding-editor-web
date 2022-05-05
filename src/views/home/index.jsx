import { useEffect, useState } from "react";
import Dropdown from "../../components/inputs/dropdown";
import useRepos from "../../hooks/repos/useRepos"
import useUser from "../../hooks/user/useUser";
import useStyles from './styles'
import Dialog from "../../components/dialog";
import { Button, Checkbox, Grid, Paper, TextField, Typography } from "@mui/material";
import { Lock, LockOpen, Save } from "@mui/icons-material";
import CodeMirror from '@uiw/react-codemirror'
import { python } from '@codemirror/lang-python'
import { autocompletion } from '@codemirror/autocomplete'

const Home = () => {
    const user = useUser()
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
                        <Grid container spacing={1} alignItems='center'>
                            <Grid item xs={3}>
                                <Dropdown
                                    size='small'
                                    fullWidth
                                    options={repos}
                                    value={repo || ''}
                                    getOptionLabel={(option) => 
                                        <Grid container spacing={1} alignItems='center'>
                                            <Grid item>
                                                { option.private ? <Lock/> : <LockOpen/>}
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="body1"><strong>{option?.name}</strong></Typography>
                                            </Grid>
                                        </Grid>
                                    }
                                    getOptionValue={(option) => option?.name}
                                    onChange={handleChangeRepo}
                                    onAdd={() => setOpen(true)}
                                />
                            </Grid>
                            <Grid item xs={9}>
                                <TextField variant="outlined"
                                    size="small"
                                    fullWidth
                                    value={commit.path}
                                    onChange={(event) => setCommit({ ...commit, path: event.target.value} )}
                                    style={{
                                        fontWeight: 'bold',
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item container xs={12} spacing={1} justifyContent='flex-end'>
                    <Grid item xs={12}>
                        <CodeMirror
                            height="70vh"
                            extensions={[python(), autocompletion()]}
                            onChange={(value, viewUpdate) => setCommit({ ...commit, content: value} )}
                            theme='dark'
                        />
                    </Grid>
                    <Grid item>
                        <Button endIcon={<Save/>} onClick={() => console.log(user)}>Save</Button>
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}

export default Home