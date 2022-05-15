import { ExitToApp } from "@mui/icons-material";
import {
  Avatar,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import { signOut } from "../../../hooks/login";
import useUser from "../../../hooks/user/useUser";

const UserMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { login, name, avatar_url } = useUser();

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleSignOut = () => signOut();

  return (
    <>
      <IconButton ref={anchorEl} onClick={handleOpen}>
        <Avatar variant="square" src={avatar_url} alt={""} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={open}
        onClose={handleClose}
      >
        <ListItem divider>
          <ListItemAvatar>
            <Avatar variant="square" src={avatar_url} alt={""} />
          </ListItemAvatar>
          <ListItemText primary={name} secondary={login} />
        </ListItem>
        <MenuItem onClick={handleSignOut}>
          <ListItemIcon>
            <ExitToApp />
          </ListItemIcon>
          <ListItemText>Exit</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
