import { useState, useEffect } from "react";

/**
 * Store a variable that will be saved in the localStorage with a given key.
 * @param {String} key : key to save and retrieve the value from the localStorage.
 * @param {String} initialState: the value that will be set if no value is found in the localStorage.
 * @returns [String, Function]
 */
function useSemiPersistentState(key, initialState) {
  const [value, setValue] = useState(localStorage.getItem(key) ?? initialState);

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
}

/**
 * Store a variable that will be saved in the localStorage with a given key and also has a limited ammount of possible states.
 * @param {String} key : key to save and retrieve the value from the localStorage.
 * @param {String} initialState: the value that will be set if no value is found in the localStorage. It must be one of the possible states of the variable.
 * @param {[String]} possibleStates: array of String of possible values of the variable.
 * @returns [String, Function]: toggleValue selects the next value in the possibleStates array for the variable.
 */
function useToggleableSemiPersistentState(key, initialState, possibleStates) {
  const [states] = useState(possibleStates);
  const [value, setValue] = useState(localStorage.getItem(key) ?? initialState);

  const toggleValue = () => {
    let currentIndex = states.indexOf(value);
    if (currentIndex === -1) {
      throw new Error(
        `Possible localStorage corruption: Value ${value} is not present in array of possible states ${states}`
      );
    }

    if (currentIndex === states.length - 1) {
      setValue(states[0]);
    } else {
      setValue(states[currentIndex + 1]);
    }
  };

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, toggleValue];
}

export { useSemiPersistentState, useToggleableSemiPersistentState };
