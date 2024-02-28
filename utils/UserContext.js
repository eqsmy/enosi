import React, { createContext, useReducer, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage"; // or import * as SecureStore from 'expo-secure-store' if using Expo

// Initial state
const initialState = {
  session: null,
  loggedIn: false,
};

// Actions
const SET_SESSION = "SET_SESSION";

// Reducer
const reducer = (state, action) => {
  switch (action.type) {
    case SET_SESSION:
      const newState = {
        ...state,
        session: action.payload,
        loggedIn: action.payload ? true : false,
      };
      return newState;
    default:
      return state;
  }
};

// Create context
const UserContext = createContext();

// Context provider
export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    // Load the session when the app starts
    const loadSession = async () => {
      const sessionData = await AsyncStorage.getItem("userSession"); // Use SecureStore.getItemAsync if using Expo
      if (sessionData) {
        dispatch({ type: SET_SESSION, payload: JSON.parse(sessionData) });
      }
    };
    loadSession();
  }, []);

  useEffect(() => {
    const saveSession = async () => {
      if (state.session) {
        await AsyncStorage.setItem(
          "userSession",
          JSON.stringify(state.session)
        );
      } else {
        await AsyncStorage.removeItem("userSession");
      }
    };
    saveSession();
  }, [state.session]);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the user context
export const useUser = () => useContext(UserContext);
