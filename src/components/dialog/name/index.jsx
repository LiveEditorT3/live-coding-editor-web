import { TextField } from "@mui/material";
import { useState, useContext } from "react";
import Dialog from "..";
import { useFluidContext } from "../../../contexts/fluidContext";
import { getDatabase, ref, set } from "firebase/database";
import { useFirebaseContext } from "../../../contexts/firebaseContext";
import { LoginContext } from "../../../hooks/login/index";

const NameDialog = ({ open, onClose }) => {
  const { setUser } = useContext(LoginContext);
  const { app } = useFirebaseContext();
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const { audience } = useFluidContext();

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
    setUser(user);
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
