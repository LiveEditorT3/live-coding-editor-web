import { Send } from "@mui/icons-material";
import { Card, CardContent, CardHeader, Grid, IconButton, Paper, TextField } from "@mui/material";
import Message from "./message";

const dummyMessages = [
    {
        user: "Juan",
        message: "Hola que tal",
        timestamp: 123
    },
    {
        user: "Federico Alvarez",
        message: "Bienvenidos",
        timestamp: 124
    },
    {
        user: "Jorge",
        message: "Hola que tal",
        timestamp: 125
    },
    {
        user: "Juan",
        message: "This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1 cup of frozen peas along with the mussels, if you like.",
        timestamp: 126
    },
    {
        user: "Horacio",
        message: "Hola que tal",
        timestamp: 127
    },
    {
        user: "Lucas",
        message: "Hola que tal",
        timestamp: 128
    },
]
const Chat = () => {
    return (
        <Card>
            <CardHeader title="Chat"/>
            <CardContent>
                <Grid container spacing={1} direction="column">
                    <Grid item xs={12}>
                        <Paper variant="outlined" elevation={0} sx={{ maxHeight: '70vh', overflow: "auto", padding: "5px" }}>
                            {
                                dummyMessages.map(message => 
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
                            />
                        </Grid>
                        <Grid item>
                            <IconButton>
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