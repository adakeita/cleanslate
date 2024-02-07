import React, { createContext, useState, useContext } from 'react';

const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(true);

  return (
    <UIContext.Provider value={{ isMenuVisible, setIsMenuVisible }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => useContext(UIContext);
