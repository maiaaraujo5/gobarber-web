import React, {createContext, useCallback, useContext, useState} from "react";
import api from '../services/api'

interface AuthState {
    token: string;
    user: object;
}

interface SignCredentials {
    email: string
    password: string
}

interface AuthContextData {
    user: object

    signIn(credentials: SignCredentials): Promise<void>

    signOut(): void
}

export const Auth = createContext<AuthContextData>({} as AuthContextData);
export const AuthProvider: React.FC = ({children}) => {

    const [data, setData] = useState<AuthState>(() => {
        const token = localStorage.getItem('@GoBarber:token');
        const user = localStorage.getItem('@Gobarber:user');

        if (token && user) {
            return {token, user: JSON.parse(user)}
        }

        return {} as AuthState;
    })

    const signIn = useCallback(async ({email, password}) => {
        const response = await api.post('sessions', {
            email,
            password
        });

        const {token, user} = response.data
        localStorage.setItem('@GoBarber:token', token);
        localStorage.setItem('@Gobarber:user', JSON.stringify(user))

        setData({token, user})
    }, [])

    const signOut = useCallback(()=> {
        localStorage.removeItem('@GoBarber:token');
        localStorage.removeItem('@Gobarber:user');

        setData({} as AuthState)
    }, [])


    return (
        <Auth.Provider value={{user: data.user, signIn, signOut}}>
            {children}
        </Auth.Provider>
    )
}

export function useAuth(): AuthContextData {
    const context = useContext(Auth)

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }

    return context
}