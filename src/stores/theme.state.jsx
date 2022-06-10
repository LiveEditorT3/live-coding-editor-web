import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    light: false
};

export const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        setTheme: (state, action) => {
            state.light = action.payload
        }
    }
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;