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
import { useState, useContext } from "react";
import { utils } from "../../../utils/utils";
import Configuration from "../../../config";
import { LoginContext } from "../../../hooks/login/index";

const UserMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { user, clearUser } = useContext(LoginContext);

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleSignOut = () => {
    localStorage.removeItem(Configuration.TOKEN_KEY);
    clearUser();
    window.location.replace(window.location.origin);
  };

  return (
    <>
      <IconButton ref={anchorEl} onClick={handleOpen}>
        {!!user.avatar_url ? (
          <Avatar variant="square" src={user.avatar_url} alt={"User avatar"} />
        ) : (
          <Avatar variant="square" alt={"User avatar"}>
            {utils.formatAvatar(user.name)}
          </Avatar>
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
            {!!user.avatar_url ? (
              <Avatar
                variant="square"
                src={user.avatar_url}
                alt={"User avatar"}
              />
            ) : (
              <Avatar variant="square" alt={"User avatar"}>
                {utils.formatAvatar(user.name)}
              </Avatar>
            )}
          </ListItemAvatar>
          <ListItemText
            primary={user.name}
            secondary={user?.login || "Guest"}
          />
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
