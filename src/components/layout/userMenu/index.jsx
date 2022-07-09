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
import { utils } from "../../../utils/utils";

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
        {!!avatar_url ? (
          <Avatar variant="square" src={avatar_url} alt={""} />
        ) : (
          <Avatar variant="square">{utils.formatAvatar(name)}</Avatar>
        )}
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
            {!!avatar_url ? (
              <Avatar variant="square" src={avatar_url} alt={""} />
            ) : (
              <Avatar variant="square">{utils.formatAvatar(name)}</Avatar>
            )}
          </ListItemAvatar>
          <ListItemText primary={name} secondary={login || "Guest"} />
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
