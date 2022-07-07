import { Brightness4, Brightness7, Close, Share } from "@mui/icons-material";
import { Checkbox, IconButton, Snackbar } from "@mui/material";
import { useState } from "react";
import useTheme from "../../../hooks/theme/useLightTheme"

const OptionsMenu = () => {
    const { lightTheme, toggleTheme } = useTheme();
    const [open, setOpen] = useState(false);

    const handleShare = (event) => {
      setOpen(true);
      navigator.clipboard.writeText(window.location.href)
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
          message="Copied link to clipboard"
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
        {
          !!window.location.hash &&
          <IconButton onClick={handleShare}>
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