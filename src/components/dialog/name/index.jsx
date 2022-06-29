import { TextField } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import Dialog from "..";
import { useFluidContext } from "../../../contexts/fluidContext";
import { setUser } from "../../../stores/user.state";
import { saveUserInStorage } from "../../../hooks/user/useUser"
import { getDatabase, ref, set } from "firebase/database";
import { useFirebaseContext } from "../../../contexts/firebaseContext";

const NameDialog = ({ open, onClose }) => {
    const { app } = useFirebaseContext();
    const [name, setName] = useState("");
    const { audience } = useFluidContext();
    const dispatch = useDispatch();

    const handleAccept = (event) => {
        const fluidUser = audience.getMyself();
        const user = { name, id: fluidUser.userId, login: "" };
        const db = getDatabase(app);
        set(ref(db, `sessions${window.location.pathname}/${user.id}`), { ...user, write: false });
        dispatch(setUser(user));
        saveUserInStorage(user);
        onClose();
    }

    return(
        <Dialog
            open={open}
            title="Welcome!"
            onClose={onClose}
            onAccept={handleAccept}
        >
            <TextField
                fullWidth
                label="Name"
                placeholder="Enter your name"
                value={name}
                onChange={(event) => setName(event.target.value)}
            />
        </Dialog>
    )
}
export default NameDialog;