import { useContext, useState } from "react";
import { TextField } from "@mui/material";
import Dialog from "..";
import { getDatabase, ref, set } from "firebase/database";
import { FirebaseContext } from "../../../contexts/firebaseContext";
import { LoginContext } from "../../../contexts/loginContext";
import { FluidContext } from "../../../contexts/fluidContext";

const NameDialog = ({ open, onClose }) => {
  const { setUser } = useContext(LoginContext);
  const { app } = useContext(FirebaseContext);
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const { audience } = useContext(FluidContext);

  const handleAccept = (event) => {
    setError(false);
    if (!name.trim()) return setError(true);
    const fluidUser = audience.getMyself();
    const user = { name, id: fluidUser.userId, login: "" };
    const db = getDatabase(app);
    set(ref(db, `participants${window.location.pathname}/${user.id}`), {
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
