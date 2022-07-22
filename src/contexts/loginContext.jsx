import { getDatabase, ref, set } from "firebase/database";
import React, {
  createContext,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from "react";
import { v4 } from "uuid";
import { useFirebaseContext } from "./firebaseContext";
import UserService from "../services/UserService";
import Configuration from "../config";
import userReducer from "../stores/user/reducer";
import { actions } from "../stores/user/actions";

export const loggedIn = () => !!localStorage.getItem(Configuration.TOKEN_KEY);

export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [user, dispatchUser] = useReducer(userReducer, {
    id: "",
    name: "",
    login: "",
  });
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem(Configuration.TOKEN_KEY)
  );
  const { app } = useFirebaseContext();

  const setUser = useCallback(
    (user) => {
      dispatchUser({ type: actions.SET_USER, payload: user });
    },
    [dispatchUser]
  );

  function clearUser() {
    dispatchUser({ type: actions.CLEAR_USER });
  }

  useEffect(() => {
    const getAccessToken = async () => {
      // Parse the temporary code from the URL
      const params = new URLSearchParams(window.location.search);
      let gitCode = params.get("code");

      if (!!gitCode) {
        // Obtain the access token
        const res = await UserService.login(gitCode);
        setLoggedIn(!!res.access_token);
        localStorage.setItem(Configuration.TOKEN_KEY, res.access_token);
        // Redirect to a new session
        window.location.replace(`${window.location.origin}/${v4()}`);
      }
    };

    getAccessToken();
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const user = await UserService.getUser();
      if (!!user) {
        const db = getDatabase(app);
        const storedUser = {
          id: user.id,
          name: user.name,
          login: user?.login,
          write: loggedIn,
          admin: window.location.pathname,
        };
        setUser({ ...storedUser, avatar_url: user.avatar_url });
        set(
          ref(db, `participants${window.location.pathname}/${user.id}`),
          storedUser
        );
      }
    };

    if (loggedIn && !user?.login) {
      getUser();
    }
  }, [setUser, user, loggedIn, app]);

  return (
    <LoginContext.Provider value={{ user, setUser, clearUser }}>
      {children}
    </LoginContext.Provider>
  );
};
