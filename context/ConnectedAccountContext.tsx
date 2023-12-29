"use client"
import React, { createContext, useContext, useState } from 'react';

interface ConnectedAccountContextProps {
  connectedAccount: string;
  setConnectedAccount: React.Dispatch<React.SetStateAction<string>>;
}

const ConnectedAccountContext = createContext<ConnectedAccountContextProps | undefined>(undefined);


export const ConnectedAccountProvider = ({ children } : { children: React.ReactNode}) => {

  const [connectedAccount, setConnectedAccount] = useState("")

  return (
    <ConnectedAccountContext.Provider value={{ connectedAccount, setConnectedAccount }}>
      {children}
    </ConnectedAccountContext.Provider>
  )
}

export const useConnectedAccount = () => {
  const context = useContext(ConnectedAccountContext)

  if (!context) {
    throw new Error('useConnectedAccount must be used within a ConnectedAccountProvider');
  }

  return context
}

