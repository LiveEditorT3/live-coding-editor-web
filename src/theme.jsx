import { createTheme } from "@mui/material";

export const getTheme = (light) =>
  createTheme({
    palette: {
      mode: light ? "light" : "dark",
    },
  });
