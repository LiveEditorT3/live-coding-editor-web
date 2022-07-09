import { createContext } from "react";
import { initializeApp } from "firebase/app";
import FirebaseConfig from "../firebaseConfig";
import { useContext } from "react";

const FirebaseContext = createContext({});

export const useFirebaseContext = () => {
  const { app } = useContext(FirebaseContext);

  return {
    app,
  };
};

const FirebaseProvider = ({ children }) => {
  const app = initializeApp(FirebaseConfig);

  return (
    <FirebaseContext.Provider value={{ app }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export default FirebaseProvider;
