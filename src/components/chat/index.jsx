import {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Paper,
} from "@mui/material";
import { Send } from "@mui/icons-material";
import { getDatabase, off, onChildAdded, push, ref } from "firebase/database";
import { FirebaseContext } from "../../contexts/firebaseContext";
import { LoginContext } from "../../contexts/loginContext";
import Message from "./message";

const Chat = ({ compact }) => {
  const { app } = useContext(FirebaseContext);
  const { user } = useContext(LoginContext);
  const [messages, setMessages] = useState([]);
  const [messageToSend, setMessageToSend] = useState("");
  const dateReference = useRef(Date.now());
  const chatRef = useRef();

  useEffect(() => {
    const db = getDatabase(app);
    const messagesRef = ref(db, `chats${window.location.pathname}`);
    onChildAdded(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data.timestamp > dateReference.current) {
        setMessages((prev) => [...prev, data]);
      }
    });

    return () => off(messagesRef);
  }, [app]);

  const sendMessage = (event) => {
    const db = getDatabase(app);
    const message = {
      user: user.name,
      message: messageToSend,
      timestamp: Date.now(),
    };
    push(ref(db, `chats${window.location.pathname}`), message);
    setMessageToSend("");
  };

  useLayoutEffect(() => {
    if (chatRef.current)
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, chatRef]);

  return (
    <Card sx={{ height: "100%" }}>
      <CardHeader title="Chat" />
      <CardContent sx={{ height: "95%" }}>
        <Grid
          container
          spacing={1}
          direction="column"
          sx={{
            height: "100%",
            display: "flex",
            flexWrap: "nowrap",
            flexDirection: "column",
          }}
        >
          <Grid item xs={12} sx={{ maxHeight: compact ? "85%" : "100%" }}>
            <Paper
              ref={chatRef}
              variant="outlined"
              elevation={0}
              sx={{ height: "100%", overflow: "auto", padding: "5px" }}
            >
              {!!messages &&
                !!messages.length &&
                messages.map((message) => (
                  <Grid key={message.timestamp} item xs={12}>
                    <Message
                      user={message.user}
                      text={message.message}
                      timestamp={message.timestamp}
                    />
                  </Grid>
                ))}
            </Paper>
          </Grid>
          <Grid
            item
            container
            xs={12}
            spacing={1}
            alignItems="center"
            sx={{
              marginBottom: compact ? "3%" : "-2.05%",
              maxHeight: compact ? "8vh" : "8vh",
            }}
          >
            <OutlinedInput
              size="small"
              fullWidth
              placeholder="Send a message"
              value={messageToSend}
              onChange={(e) => setMessageToSend(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={sendMessage}>
                    <Send />
                  </IconButton>
                </InputAdornment>
              }
              sx={{
                borderRadius: "20px",
                paddingRight: "1px",
                marginLeft: "8px",
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default Chat;
