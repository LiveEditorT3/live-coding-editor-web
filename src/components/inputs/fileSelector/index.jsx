import { PostAdd } from "@mui/icons-material";
import { IconButton, List, ListItem, ListItemButton, ListItemText, TextField } from "@mui/material";
import { useState } from "react";

const FileSelector = ({ files, onSelect, onAddFile }) => {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState("")
    return(
        <List>
            <ListItem dense disableGutters sx={{display:'flex', justifyContent:'flex-end'}}>
                <IconButton onClick={() => setOpen(true)}>
                    <PostAdd/>
                </IconButton>
            </ListItem>
            {
                open &&
                <ListItem dense disableGutters>
                    <TextField 
                        fullWidth
                        size="small"
                        variant="outlined"
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                setOpen(false)
                                onAddFile(name)
                        }}}
                    />
                </ListItem>
            }
            {
                !!files && !!files.length &&
                files.map(file => (
                    <ListItem disableGutters dense key={file.sha}>
                        <ListItemButton dense onClick={() => onSelect(file)}>
                            <ListItemText>{file.name}</ListItemText>
                        </ListItemButton>
                    </ListItem>))
            }
        </List>
    )
}
export default FileSelector;