import { TextField } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import Dialog from "..";
import { useFluidContext } from "../../../contexts/fluidContext";
import { setUser } from "../../../stores/user.state";
import { saveUserInStorage } from "../../../hooks/user/useUser";
import { getDatabase, ref, set } from "firebase/database";
import { useFirebaseContext } from "../../../contexts/firebaseContext";

const NameDialog = ({ open, onClose }) => {
  const { app } = useFirebaseContext();
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const { audience } = useFluidContext();
  const dispatch = useDispatch();

  const handleAccept = (event) => {
    setError(false);
    if (!name.trim()) return setError(true);
    const fluidUser = audience.getMyself();
    const user = { name, id: fluidUser.userId, login: "" };
    const db = getDatabase(app);
    set(ref(db, `sessions${window.location.pathname}/${user.id}`), {
      ...user,
      write: false,
    });
    dispatch(setUser(user));
    saveUserInStorage(user);
    onClose();
  };

  return (
    <Dialog open={open} title="Welcome!" onAccept={handleAccept}>
      <TextField
        fullWidth
        error={error}
        label="Name"
        placeholder="Enter your name"
        helperText={error ? "Please enter your name to continue" : null}
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
    </Dialog>
  );
};
export default NameDialog;
