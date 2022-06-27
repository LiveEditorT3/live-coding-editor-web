import { createContext, useState } from "react";
import { initializeApp } from "firebase/app";
import FirebaseConfig from "../firebaseConfig";
import { useContext } from "react";

const FirebaseContext = createContext({});

export const useFirebaseContext = () => {
    const { app, messages, setMessages } = useContext(FirebaseContext);

    const addMessage = (message) => {
        setMessages([...messages, message])
    }
    
    return {
        app,
        messages,
        addMessage
    };
};

const FirebaseProvider = ({ children }) => {
    const app = initializeApp(FirebaseConfig);
    const [messages, setMessages] = useState([]);

    return (
        <FirebaseContext.Provider value={{ app, messages, setMessages }}>
            {children}
        </FirebaseContext.Provider>
    );
};

export default FirebaseProvider