import { Send } from "@mui/icons-material";
import { Card, CardContent, CardHeader, Grid, IconButton, Paper, TextField } from "@mui/material";
import { useEffect } from "react";
import { useFirebaseContext } from "../../contexts/firebaseContext";
import { getDatabase, onChildAdded, push, ref } from "firebase/database";
import Message from "./message";
import { useState } from "react";
import useUser from "../../hooks/user/useUser";
import { useRef } from "react";

const Chat = () => {
    const { app } = useFirebaseContext();
    const { name } = useUser();
    const [messages, setMessages] = useState([]);
    const [messageToSend, setMessageToSend] = useState("");
    const dateReference = useRef(Date.now());

    useEffect(() => {
        const db = getDatabase(app);
        const messagesRef = ref(db, `chats${window.location.pathname}`);
        onChildAdded(messagesRef, (snapshot) => {
            const data = snapshot.val();
            if (data.timestamp > dateReference.current){
                setMessages(prev => [...prev, data]);
        }});

        return () => messagesRef.off();
    }, [app]);

    const sendMessage = (event) => {
        const db = getDatabase(app);
        const message = { user: name, message:messageToSend, timestamp: Date.now() }
        push(ref(db, `chats${window.location.pathname}`), message);
        setMessageToSend("")
    }
    return (
        <Card>
            <CardHeader title="Chat"/>
            <CardContent>
                <Grid container spacing={1} direction="column">
                    <Grid item xs={12}>
                        <Paper variant="outlined" elevation={0} sx={{ maxHeight: '70vh', overflow: "auto", padding: "5px" }}>
                            {
                                !!messages && !!messages.length && messages.map(message => 
                                    <Grid key={message.timestamp} item xs={12}>
                                        <Message user={message.user} text={message.message} timestamp={message.timestamp}/>
                                    </Grid>)
                            }
                        </Paper>
                    </Grid>
                    <Grid item container xs={12} spacing={1} sx={{ display: "flex", flexWrap: "nowrap" }}>
                        <Grid item sx={{ flex: 1 }}>
                            <TextField
                                size="small"
                                fullWidth
                                placeholder="Send a message"
                                value={messageToSend}
                                onChange={(e) => setMessageToSend(e.target.value)}
                            />
                        </Grid>
                        <Grid item>
                            <IconButton onClick={sendMessage}>
                                <Send/>
                            </IconButton>
                        </Grid>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}
export default Chat;