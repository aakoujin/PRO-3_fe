/*
import { createContext, useState, ReactNode } from "react";

export interface authData {
  token: string
}

interface IAuthContext {
  authData: authData | undefined,
  setState: (authInfo:authData) => void
}

const AuthContext = createContext<IAuthContext>( {
  authData: undefined,
  setState: () => { }
})

const { Provider } = AuthContext


const AuthProvider = (props: any) => {
  const [authState, setAuthState] = useState<authData | undefined>()

  const setAuthInfo = (data:authData) => {
    console.log('setting AuthInfo')
    setAuthState({
      token: data!.token
    })
  }

  return (
    <Provider
      value={{
        authData: authState,
        setState: (authInfo:authData) => setAuthInfo(authInfo)
      }} {...props}
    />
  )
}

export { AuthContext, AuthProvider }
*/


import { createContext, useState, useEffect, ReactNode } from "react";

export interface authData {
  token: string;
}

interface IAuthContext {
  authData: authData | undefined;
  setState: (authInfo: authData) => void;
}

const AuthContext = createContext<IAuthContext>({
  authData: undefined,
  setState: () => {}
});

const { Provider } = AuthContext;

const AuthProvider = (props: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<authData | undefined>(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      //add expiration check
      return { token: storedToken };
    }
    return undefined;
  });

  useEffect(() => {
    if (authState?.token) {
      localStorage.setItem("authToken", authState.token);
    } else {
      localStorage.removeItem("authToken");
    }
  }, [authState]);

  const setAuthInfo = (data: authData) => {
    setAuthState({
      token: data.token
    });
  };

  const logout = () => {
    setAuthState(undefined);
  };

  return (
    <Provider
      value={{
        authData: authState,
        setState: (authInfo: authData) => setAuthInfo(authInfo)
      }}
      {...props}
    />
  );
};

export { AuthContext, AuthProvider };