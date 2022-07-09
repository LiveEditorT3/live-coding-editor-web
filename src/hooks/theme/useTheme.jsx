import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "../../stores/theme.state";

import { createTheme } from "@mui/material";

const getTheme = (light) =>
  createTheme({
    palette: {
      mode: light ? "light" : "dark",
    },
});

const useTheme = () => {
  const state = useSelector((store) => store.theme);
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage) {
      const light = JSON.parse(localStorage.getItem("light"));
      dispatch(setTheme(light));
    }
  }, [dispatch]);

  const toggleTheme = () => {
    localStorage?.setItem("light", !state.light);
    dispatch(setTheme(!state.light));
  };

  return {
    lightTheme: state.light,
    toggleTheme,
  };
};

export { useTheme, getTheme };
