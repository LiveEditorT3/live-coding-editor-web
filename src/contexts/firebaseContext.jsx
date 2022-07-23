import { createContext } from "react";
import { initializeApp } from "firebase/app";
import FirebaseConfig from "../firebaseConfig";

export const FirebaseContext = createContext({});

const FirebaseProvider = ({ children }) => {
  const app = initializeApp(FirebaseConfig);

  return (
    <FirebaseContext.Provider value={{ app }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export default FirebaseProvider;
