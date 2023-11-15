import React, { createContext, useContext, useState } from 'react';


const UserContext = createContext();


export const useUser = () => {
  return useContext(UserContext);
};


export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const login = (username) => {
    setUser({
      username: username,
      isLoggedIn: true, 
    });
  };
  

  const logout = () => {
    setUser({
      username:null,
      isLoggedIn:false,
    });
  };

  const userContextValue = {
    user,
    login,
    logout,
  };

  return (
    <UserContext.Provider value={userContextValue}>
      {children}
    </UserContext.Provider>
  );
};
