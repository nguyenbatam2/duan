"use client";

import { createContext, useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";

type AuthorType = {
    id: string;
    name: string;
    email: string;
} | null;

interface AuthContextType {
    author: AuthorType;
    login: (data: AuthorType) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    author: null,
    login: () => { },
    logout: () => { },
});

export const AuthProviderContext = ({ children }: { children: React.ReactNode }) => {
    const [author, setAuthor] = useState<AuthorType>(null);

    useEffect(() => {
        const cookieData = Cookies.get("author");
        if (cookieData) {
            try {
                const parsed = JSON.parse(cookieData);
                setAuthor(parsed);
            } catch (error) {
                console.error("Invalid cookie", error);
            }
        }
    }, []);

    const login = (data: AuthorType) => {
        Cookies.set("author", JSON.stringify(data));
        setAuthor(data);
    };

    const logout = () => {
        Cookies.remove("author");
        setAuthor(null);
    };

    return (
        <AuthContext.Provider value={{ author, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook tiện lợi nếu cần
export const useAuth = () => useContext(AuthContext);
