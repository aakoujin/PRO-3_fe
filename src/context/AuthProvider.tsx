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