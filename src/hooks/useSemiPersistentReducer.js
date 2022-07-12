import { useReducer, useEffect } from "react";

function retrieveKeyAndParse(key) {
  let result = localStorage.getItem(key);
  return result ? JSON.parse(result) : undefined;
}

/**
 * Use a reducer whose variable will be saved in the localStorage with a given key.
 * @param {String} key : key to save and retrieve the value from the localStorage.
 * @param {Function} reducer: the reducer function for useReducer().
 * @param {any} initialState: the initial value that will be set if no value is found in the localStorage.
 * @returns [any, Function]
 */
function useSemiPersistentReducer(key, reducer, initialState) {
  const [value, dispatchValue] = useReducer(
    reducer,
    retrieveKeyAndParse(key) ?? initialState
  );

  useEffect(() => {
    // Falsy values trigger a removal
    if (!value) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, [value, key]);

  return [value, dispatchValue];
}

export { useSemiPersistentReducer };
