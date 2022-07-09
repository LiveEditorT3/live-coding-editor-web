import { makeStyles } from "@mui/styles";

export default makeStyles({
    root: {
        flexDirection: "column",
        height: "100%",
        paddingTop: "10px",
        "& .MuiAvatar-root": {
            margin: "4px 0px"
        },
        "& .MuiChip-label": {
            writingMode: "vertical-rl",
            transform: "scale(-1)",
            whiteSpace: "normal",
            textOverflow: "clip",
            textAlign: "center",
            fontSize: 16,
        },
        "& .MuiChip-deleteIcon": {
            margin: "8px 0px"
        }
    }
});