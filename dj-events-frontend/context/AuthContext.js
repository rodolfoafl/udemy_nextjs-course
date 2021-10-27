import { createContext, useState, useEffect } from "react";
import  {useRouter} from 'next/router';
import { API_URL } from "../config";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    const register = async (user) => {
        console.log(user);
    } 

    const login = async ({email: identifier, password}) =>{
        console.log({identifier, password});
    }

    const logout = async () => {
        console.log('logout');
    }

    const checkUserLoggedIn = async (user) => {
        console.log('check');
    }

    return (
        <AuthContext.Provider value= {{user, error, register, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;