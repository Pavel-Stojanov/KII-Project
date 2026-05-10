import {useCallback, useEffect, useMemo, useState, type ReactNode} from 'react';
import {
    clearStoredToken,
    getStoredToken,
    setStoredToken,
    setUnauthorizedHandler,
} from '../api';
import {authRepository} from '../repositories/authRepository';
import type {AuthResponse, AuthUser, LoginRequest, RegisterRequest} from '../types';
import {AuthContext} from './AuthContext';

interface AuthProviderProps {
    children: ReactNode;
}

interface AuthSession {
    token: string | null;
    user: AuthUser | null;
}

const AUTH_USER_KEY = 'auth_user';

const getStoredUser = (): AuthUser | null => {
    const rawUser = localStorage.getItem(AUTH_USER_KEY);

    if (!rawUser) {
        return null;
    }

    try {
        return JSON.parse(rawUser) as AuthUser;
    } catch {
        localStorage.removeItem(AUTH_USER_KEY);
        return null;
    }
};

const setStoredUser = (user: AuthUser) => {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
};

const clearStoredUser = () => {
    localStorage.removeItem(AUTH_USER_KEY);
};

const getStoredSession = (): AuthSession => {
    const token = getStoredToken();
    const user = getStoredUser();

    if (token && user) {
        return {token, user};
    }

    clearStoredToken();
    clearStoredUser();

    return {token: null, user: null};
};

export default function AuthProvider({children}: AuthProviderProps) {
    const [session, setSession] = useState<AuthSession>(() => getStoredSession());
    const {token, user} = session;

    const storeSession = useCallback((response: AuthResponse) => {
        const nextUser = {
            username: response.username,
            role: response.role,
        };

        setStoredToken(response.token);
        setStoredUser(nextUser);
        setSession({token: response.token, user: nextUser});
    }, []);

    const logout = useCallback(() => {
        clearStoredToken();
        clearStoredUser();
        setSession({token: null, user: null});
    }, []);

    useEffect(() => {
        setUnauthorizedHandler(logout);
        return () => setUnauthorizedHandler(null);
    }, [logout]);

    const login = useCallback(async (credentials: LoginRequest) => {
        const response = await authRepository.login(credentials);
        storeSession(response);
    }, [storeSession]);

    const register = useCallback(async (request: RegisterRequest) => {
        const response = await authRepository.register(request);
        storeSession(response);
    }, [storeSession]);

    const value = useMemo(() => ({
        token,
        user,
        role: user?.role ?? null,
        isAdmin: user?.role === 'ROLE_ADMIN',
        isAuthenticated: Boolean(token && user),
        login,
        register,
        logout,
    }), [login, logout, register, token, user]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
