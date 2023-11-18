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
      console.log("Dispatched SET_SESSION with user:", action.payload);
      return {
        ...state,
        session: action.payload,
        loggedIn: !!action.payload,
      };
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
