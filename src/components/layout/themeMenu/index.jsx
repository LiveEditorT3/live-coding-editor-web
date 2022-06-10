import { Brightness4, Brightness7 } from "@mui/icons-material";
import { Checkbox } from "@mui/material";
import useTheme from "../../../hooks/theme/useLightTheme"

const ThemeMenu = () => {
    const { lightTheme, toggleTheme } = useTheme();
    return(
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
    )
}

export default ThemeMenu;