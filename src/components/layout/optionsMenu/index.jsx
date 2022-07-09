import { Brightness4, Brightness7, Close, ContentCopy, Link, Share } from "@mui/icons-material";
import { Avatar, Checkbox, IconButton, ListItem, ListItemAvatar, ListItemIcon, ListItemText, Menu, MenuItem, Snackbar } from "@mui/material";
import { useState } from "react";
import useTheme from "../../../hooks/theme/useLightTheme"

const OptionsMenu = () => {
    const { lightTheme, toggleTheme } = useTheme();
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const menuOpen = Boolean(anchorEl);

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleShare = (full) => {
      setOpen(true);
      navigator.clipboard.writeText(full ? window.location.href : window.location.href.substring(window.location.origin.length + 1))
    }

    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setOpen(false);
    };

    return(
      <>
        <Snackbar 
          open={open} 
          autoHideDuration={5000} 
          message="Copied to clipboard"
          onClose={handleClose}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <Close fontSize="small" />
            </IconButton>
          }
        />
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
          open={menuOpen}
          onClose={handleMenuClose}
        >
          <ListItem divider>
            <ListItemAvatar>
              <Avatar>
                <Share/>
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Share Options" />
          </ListItem>
          <MenuItem onClick={() => handleShare(true)}>
            <ListItemIcon>
              <Link />
            </ListItemIcon>
            <ListItemText>Link</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleShare(false)}>
            <ListItemIcon>
              <ContentCopy />
            </ListItemIcon>
            <ListItemText>Session Id</ListItemText>
          </MenuItem>
        </Menu>
        {
          !!window.location.hash &&
            <IconButton onClick={handleMenuOpen}>
              <Share sx={{color: "white"}}/>
            </IconButton>
        }
        <Checkbox
            onClick={toggleTheme}
            checked={lightTheme}
            checkedIcon={<Brightness7/>}
            icon={<Brightness4/>}
            sx={{
                color: "white",
                '&.Mui-checked': {
                  color: "white",
                },
              }}
        />
      </>
    )
}

export default OptionsMenu;