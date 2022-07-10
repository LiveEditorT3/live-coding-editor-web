import { getDatabase, ref, set } from "firebase/database";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 } from "uuid";
import { useFirebaseContext } from "../../contexts/firebaseContext";
import userService from "../../services/userService";
import { setUser } from "../../stores/user.state";
import { clearUser, saveUserInStorage } from "../user/useUser";
import Configuration from "../../config";

export const signOut = () => {
  localStorage.removeItem(Configuration.TOKEN_KEY);
  clearUser();
  window.location.replace(window.location.origin);
};

const getCode = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("code");
};

export const loggedIn = () => !!localStorage.getItem(Configuration.TOKEN_KEY);

export const LoginProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem(Configuration.TOKEN_KEY)
  );
  const { login } = useSelector((store) => store.user.user.login);
  const { app } = useFirebaseContext();
  const dispatch = useDispatch();

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
        saveUserInStorage({ user });
        dispatch(setUser(user));
        set(ref(db, `sessions${window.location.pathname}/${user.id}`), {
          id: user.id,
          name: user.name,
          login: user.login,
          write: loggedIn,
          admin: loggedIn,
        });
      }
    };

    if (loggedIn && !login) {
      getUser();
    } else if (!!localUser && localUser.login !== login) {
      const db = getDatabase(app);
      set(ref(db, `sessions${window.location.pathname}/${localUser.id}`), {
        id: localUser.id,
        name: localUser.name,
        login: localUser.login,
        write: loggedIn,
      });
      dispatch(setUser(localUser));
    }
  }, [dispatch, login, loggedIn, app]);

  return <>{children}</>;
};
