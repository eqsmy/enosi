import React, { createContext, useReducer, useContext } from "react";

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
      //console.log("Dispatched SET_SESSION with data:", action.payload);
      const newState = {
        ...state,
        session: action.payload,
        loggedIn: !!action.payload,
      };
      //console.log("New State after dispatch:", newState);
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

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the user context
export const useUser = () => useContext(UserContext);
