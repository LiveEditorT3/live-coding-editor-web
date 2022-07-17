import { getDatabase, ref, set } from "firebase/database";
import React, { useEffect, useState, createContext, useCallback } from "react";
import { v4 } from "uuid";
import { useFirebaseContext } from "./firebaseContext";
import userService from "../services/userService";
import Configuration from "../config";
import userReducer from "../stores/user/reducer";
import { actions } from "../stores/user/actions";
import { useSemiPersistentReducer } from "../hooks/useSemiPersistentReducer";

const getCode = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("code");
};

export const loggedIn = () => !!localStorage.getItem(Configuration.TOKEN_KEY);

export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [user, dispatchUser] = useSemiPersistentReducer("user", userReducer, {
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
      dispatchUser({
        type: actions.SET_USER,
        payload: user,
      });
    },
    [dispatchUser]
  );

  function clearUser() {
    dispatchUser({
      type: actions.CLEAR_USER,
    });
  }

  useEffect(() => {
    const getAccessToken = async () => {
      var gitCode = getCode();
      if (!!gitCode) {
        const res = await userService.Login(gitCode);
        setLoggedIn(!!res.access_token);
        localStorage.setItem(Configuration.TOKEN_KEY, res.access_token);
        window.location.replace(`${window.location.origin}/${v4()}`);
      }
    };

    getAccessToken();
  }, []);

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem("user"));

    const getUser = async () => {
      const user = await userService.GetUser();
      if (!!user) {
        const db = getDatabase(app);
        setUser(user);
        set(ref(db, `sessions${window.location.pathname}/${user.id}`), {
          id: user.id,
          name: user.name,
          login: user?.login,
          write: loggedIn,
          admin: loggedIn,
        });
      }
    };

    if (loggedIn && !user?.login) {
      getUser();
    } else if (!!localUser && localUser.login !== user?.login) {
      const db = getDatabase(app);
      set(ref(db, `sessions${window.location.pathname}/${localUser.id}`), {
        id: localUser.id,
        name: localUser.name,
        login: localUser.login,
        write: loggedIn,
      });
      setUser(localUser);
    }
  }, [setUser, user, loggedIn, app]);

  return (
    <LoginContext.Provider value={{ user, setUser, clearUser }}>
      {children}
    </LoginContext.Provider>
  );
};
