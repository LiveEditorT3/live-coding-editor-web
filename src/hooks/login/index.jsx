import { getDatabase, ref, set } from "firebase/database";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 } from "uuid";
import { useFirebaseContext } from "../../contexts/firebaseContext";
import userService from "../../services/userService";
import { setUser } from "../../stores/user.state";
import {
  clearUser,
  getUserFromStorage,
  saveUserInStorage,
} from "../user/useUser";

export const TOKEN_KEY = "x-token";

export const signOut = () => {
  clearToken();
  clearUser();
};
export const clearToken = () => {
  localStorage && localStorage.removeItem(TOKEN_KEY);
  window.location.replace(window.location.origin);
};

const getCode = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("code");
};

export const loggedIn = () => !!getTokenInStorage();

export const getTokenInStorage = () =>
  localStorage && localStorage.getItem(TOKEN_KEY);

export const saveTokenInStorage = (token, key = TOKEN_KEY) =>
  localStorage && localStorage.setItem(key, token);

export const LoginProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(!!getTokenInStorage());
  const { login } = useSelector((store) => store.user.user.login);
  const { app } = useFirebaseContext();
  const dispatch = useDispatch();

  useEffect(() => {
    const getAccessToken = async () => {
      var gitCode = getCode();
      if (!!gitCode) {
        userService.Login(gitCode).then((res) => {
          setLoggedIn(!!res.access_token);
          saveTokenInStorage(res.access_token);
          window.location.replace(`${window.location.origin}/${v4()}`);
        });
      }
    };

    getAccessToken();
  }, []);

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem("user"));

    const getUser = () => {
      userService.GetUser().then((user) => {
        if (!!user) {
          saveUserInStorage({ user });
          dispatch(setUser(user));
        }
      });
    };

    if (!!localUser && localUser.login !== login) {
      const db = getDatabase(app);
      set(ref(db, `sessions${window.location.pathname}/${localUser.id}`), { id: localUser.id, name: localUser.name, login: localUser.login, write: loggedIn });
      dispatch(setUser(localUser));
    }
    else if (loggedIn && !login) 
      getUser();
  }, [dispatch, login, loggedIn, app]);

  return <>{children}</>;
};
