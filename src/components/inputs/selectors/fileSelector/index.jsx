import { Cancel, PostAdd } from "@mui/icons-material";
import {
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { extractFilenameAndExtension } from "../../../../models/languageModes";
import { fileExtensionToIcon } from "../../../../models/supportedLanguages";

const FileSelector = ({ files, onSelect, onAddFile }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  return (
    <List>
      <ListItem
        dense
        disableGutters
        sx={{ display: "flex", justifyContent: "flex-end" }}
      >
        <IconButton onClick={() => setOpen(true)}>
          <PostAdd />
        </IconButton>
      </ListItem>
      {open && (
        <ListItem dense disableGutters>
          <TextField
            fullWidth
            label="New File"
            size="small"
            variant="outlined"
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setOpen(false);
                onAddFile(name);
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setOpen(false)} edge="end">
                    <Cancel />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </ListItem>
      )}
      {!!files &&
        !!files.length &&
        files.map((file) => (
          <ListItem disableGutters dense key={file.sha}>
            <ListItemButton dense onClick={() => onSelect(file)}>
              <ListItemIcon sx={{ minWidth: "25px" }}>
                <img
                  src={fileExtensionToIcon(extractFilenameAndExtension(file.name).extension)}
                  alt={file.name}
                  width={15}
                  height={15}
                />
              </ListItemIcon>
              <ListItemText>{file.name}</ListItemText>
            </ListItemButton>
          </ListItem>
        ))}
    </List>
  );
};
export default FileSelector;
